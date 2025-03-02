const Board = require('../models/Board');
const Card = require('../models/Card');

exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({ userId: req.user._id });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.status(200).json(board);
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addColumn = async (req, res) => {
    const { name } = req.body;
    
    try {
      let board = await Board.findOne({ userId: req.user._id });
  
      // If no board exists for the user, create a new board
      if (!board) {
        board = new Board({
          userId: req.user._id,
          columns: []
        });
      }
  
      const newColumn = {
        name,
        cards: [],
      };
  
      board.columns.push(newColumn);  // Add the new column to the board
      await board.save();  // Save the updated board
  
      res.status(200).json(newColumn);  // Return the newly created column
    } catch (error) {
      console.error('Error adding column:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  // Remove a column
 exports.removeColumn = async (req, res) => {
    const { columnId } = req.params;
    try {
      const board = await Board.findOne({ userId: req.user._id });
      const columnIndex = board.columns.findIndex(col => col._id.toString() === columnId);  // Compare string
      if (columnIndex === -1) {
        return res.status(404).json({ message: 'Column not found' });
      }
      board.columns.splice(columnIndex, 1);
      await board.save();
      res.status(200).json({ message: 'Column removed successfully' });
    } catch (error) {
      console.error('Error removing column:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

    
  exports.addCardToColumn = async (req, res) => {
    const { columnId } = req.params;
    const { title } = req.body;
  
    console.log("Received card data:", req.body);
  
    if (!title) {
      return res.status(400).json({ message: 'Card title is required' });
    }
  
    try {
      const board = await Board.findOne({ userId: req.user._id });
      if (!board) {
        console.error('Board not found for user', req.user._id);
        return res.status(404).json({ message: 'Board not found' });
      }
  
      const column = board.columns.id(columnId);
      if (!column) {
        console.error('Column not found for columnId:', columnId);
        return res.status(404).json({ message: 'Column not found' });
      }
  
      const newCard = new Card({ title });
  
      await newCard.save();
      console.log('Card created successfully:', newCard);
  
      column.cards.push(newCard._id);
  
      await board.save();
  
      res.status(200).json({ message: 'Card added successfully', card: newCard });
    } catch (error) {
      console.error('Error adding card:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  
  exports.removeCard = async (req, res) => {
    const { cardId } = req.params;
    try {
      const board = await Board.findOne({ userId: req.user._id });
      const column = board.columns.find(col => col.cards.id(cardId));
      if (!column) {
        return res.status(404).json({ message: 'Card not found' });
      }
      column.cards.id(cardId).remove();
      await board.save();
      res.status(200).json({ message: 'Card removed successfully' });
    } catch (error) {
      console.error('Error removing card:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.moveCard = async (req, res) => {
    const { cardId, targetColumnId } = req.body;
    try {
      const board = await Board.findOne({ userId: req.user._id });
      const sourceColumn = board.columns.find(col => col.cards.id(cardId));
      const targetColumn = board.columns.id(targetColumnId);
      if (!sourceColumn || !targetColumn) {
        return res.status(404).json({ message: 'Column not found' });
      }
      const card = sourceColumn.cards.id(cardId);
      sourceColumn.cards.id(cardId).remove();  // Remove the card from the source column
      targetColumn.cards.push(card);  // Add card to the target column
      await board.save();
      res.status(200).json({ message: 'Card moved successfully' });
    } catch (error) {
      console.error('Error moving card:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
 exports.renameColumn = async (req, res) => {
    const { columnId } = req.params;
    const { name } = req.body;
  
    try {
      const board = await Board.findOne({ userId: req.user._id });
      const column = board.columns.id(columnId); // Find the column by its _id
  
      if (!column) {
        return res.status(404).json({ message: 'Column not found' });
      }
  
      column.name = name;  // Rename
      await board.save();
  
      res.status(200).json({ message: 'Column renamed successfully', column });
    } catch (error) {
      console.error('Error renaming column:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  