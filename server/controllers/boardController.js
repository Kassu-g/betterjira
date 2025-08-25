const mongoose = require('mongoose');
const Board = require('../models/Board');
const Card = require('../models/Card');

async function getOrCreateBoard(userId) {
  let board = await Board.findOne({ userId }).populate('columns.cards').exec();
  if (!board) {
    board = new Board({ userId, columns: [] });
    await board.save();
  }
  return board;
}

exports.getBoard = async (req, res) => {
  try {
    const board = await getOrCreateBoard(req.user._id);
    return res.status(200).json({ columns: board.columns });
  } catch (error) {
    console.error('getBoard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addColumn = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Column name required' });

    const board = await getOrCreateBoard(req.user._id);
    board.columns.push({ name, cards: [] });
    await board.save();

    const updated = await Board.findById(board._id).populate('columns.cards').exec();
    return res.status(201).json({ columns: updated.columns });
  } catch (error) {
    console.error('addColumn error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.renameColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { name } = req.body;

    const board = await Board.findOne({ userId: req.user._id }).exec();
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const col = board.columns.id(columnId);
    if (!col) return res.status(404).json({ message: 'Column not found' });

    col.name = name ?? col.name;
    await board.save();

    const updated = await Board.findById(board._id).populate('columns.cards').exec();
    return res.status(200).json({ columns: updated.columns });
  } catch (error) {
    console.error('renameColumn error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    const board = await Board.findOne({ userId: req.user._id }).exec();
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const col = board.columns.id(columnId);
    if (!col) return res.status(404).json({ message: 'Column not found' });

    // Poista sarakkeen kortit 
    if (col.cards?.length) {
      await Card.deleteMany({ _id: { $in: col.cards } });
    }

    col.deleteOne();
    await board.save();

    const updated = await Board.findById(board._id).populate('columns.cards').exec();
    return res.status(200).json({ columns: updated.columns });
  } catch (error) {
    console.error('removeColumn error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addCardToColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Card title is required' });

    const board = await Board.findOne({ userId: req.user._id }).exec();
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const col = board.columns.id(columnId);
    if (!col) return res.status(404).json({ message: 'Column not found' });

    const card = await Card.create({ title });
    col.cards.push(card._id);
    await board.save();

    const updated = await Board.findById(board._id).populate('columns.cards').exec();
    return res.status(201).json({ columns: updated.columns });
  } catch (error) {
    console.error('addCardToColumn error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const board = await Board.findOne({ userId: req.user._id }).exec();
    if (!board) return res.status(404).json({ message: 'Board not found' });

    let found = false;
    for (const col of board.columns) {
      const idx = col.cards.findIndex(id => id.toString() === cardId);
      if (idx !== -1) {
        col.cards.splice(idx, 1);
        found = true;
        break;
      }
    }
    if (!found) return res.status(404).json({ message: 'Card not found' });

    await Card.findByIdAndDelete(cardId);
    await board.save();

    const updated = await Board.findById(board._id).populate('columns.cards').exec();
    return res.status(200).json({ columns: updated.columns });
  } catch (error) {
    console.error('removeCard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.moveCard = async (req, res) => {
  try {
    const { fromColumnId, toColumnId, cardId, toIndex } = req.body;

    const board = await Board.findOne({ userId: req.user._id }).exec();
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const fromCol = board.columns.id(fromColumnId);
    const toCol = board.columns.id(toColumnId);
    if (!fromCol || !toCol) return res.status(404).json({ message: 'Column not found' });

    const fromIdx = fromCol.cards.findIndex(id => id.toString() === cardId);
    if (fromIdx === -1) return res.status(404).json({ message: 'Card not in source column' });

    const [movedId] = fromCol.cards.splice(fromIdx, 1);

    const insertAt = Math.max(0, Math.min(typeof toIndex === 'number' ? toIndex : toCol.cards.length, toCol.cards.length));
    toCol.cards.splice(insertAt, 0, movedId);

    await board.save();

    const updated = await Board.findById(board._id).populate('columns.cards').exec();
    return res.status(200).json({ columns: updated.columns });
  } catch (error) {
    console.error('moveCard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.reorderColumnCards = async (req, res) => {
  try {
    const { columnId } = req.params; // = newColumnId
    const { cardId, newOrder, oldColumnId, oldOrder } = req.body;

    if (!Array.isArray(newOrder)) {
      return res.status(400).json({ message: 'newOrder must be an array of card ids' });
    }

    const board = await Board.findOne({ userId: req.user._id }).exec();
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const newCol = board.columns.id(columnId);
    if (!newCol) return res.status(404).json({ message: 'Target column not found' });

    newCol.cards = newOrder.map(id => new mongoose.Types.ObjectId(id));

    if (oldColumnId && oldColumnId !== columnId) {
      const oldCol = board.columns.id(oldColumnId);
      if (oldCol) {
        if (Array.isArray(oldOrder)) {
          // oldOrderin käytetään suoraan
          oldCol.cards = oldOrder.map(id => new mongoose.Types.ObjectId(id));
        } else if (cardId) {
          
          oldCol.cards = oldCol.cards.filter(id => id.toString() !== cardId);
        }
      }
    } else {
      const seen = new Set();
      newCol.cards = newCol.cards.filter(id => {
        const s = id.toString();
        if (seen.has(s)) return false;
        seen.add(s);
        return true;
      });
    }

    await board.save();

    const updated = await Board.findById(board._id).populate('columns.cards').exec();
    return res.status(200).json({ columns: updated.columns });
  } catch (error) {
    console.error('reorderColumnCards error:', error);
    // lokitusta
    return res.status(500).json({ message: 'Server error', error: String(error && error.stack || error) });
  }
};
exports.reorderBoardColumns = async (req, res) => {
  try {
    const { newOrder } = req.body; // taulukko columnId:itä
    if (!Array.isArray(newOrder)) {
      return res.status(400).json({ message: 'newOrder must be an array of column ids' });
    }

    const board = await Board.findOne({ userId: req.user._id }).exec();
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const newCols = [];
    newOrder.forEach(id => {
      const col = board.columns.id(id);
      if (col) newCols.push(col);
    });
    board.columns = newCols;

    await board.save();
    const updated = await Board.findById(board._id).populate('columns.cards').exec();
    return res.status(200).json({ columns: updated.columns });
  } catch (err) {
    console.error('reorderBoardColumns error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, color } = req.body;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    if (title !== undefined) card.title = title;
    if (color !== undefined) card.color = color;

    await card.save();
    return res.status(200).json(card);
  } catch (err) {
    console.error('updateCard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


