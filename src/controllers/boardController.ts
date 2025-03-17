import { Request, Response } from 'express';
import Board from '../models/Board';
import Card from '../models/Card';
import { IBoard } from '../models/Board';
import { ICard } from '../models/Card';  // Importteja

interface CustomRequest extends Request {
  user?: any; 
}

export const getBoard = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const board: IBoard | null = await Board.findOne({ userId: req.user._id });

    if (!board) {
      res.status(404).json({ message: 'Board not found' });
    }

    res.status(200).json(board);
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const removeColumn = async (req: CustomRequest, res: Response): Promise<void> => {
  const { columnId } = req.params;

  try {
    const board: IBoard | null = await Board.findOne({ userId: req.user._id });

    const columnIndex = board?.columns.findIndex(col => col._id.toString() === columnId);

    if (columnIndex === undefined || columnIndex === -1) {
      
       res.status(404).json({ message: 'Column not found' });
    }

    board?.columns.splice(columnIndex, 1);
    await board?.save();

    res.status(200).json({ message: 'Column removed successfully' });
  } catch (error) {
    console.error('Error removing column:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addCardToColumn = async (req: CustomRequest, res: Response): Promise<void> => {
  const { columnId } = req.params;
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ message: 'Card title is required' });
  }

  try {
    const board: IBoard | null = await Board.findOne({ userId: req.user._id });

    if (!board) {
      res.status(404).json({ message: 'Board not found' });
    }

    const column = board.columns.find(col => col._id.toString() === columnId); // finding the column
    if (!column) {
      res.status(404).json({ message: 'Column not found' });
    }

    const newCard: ICard = new Card({ title });
    await newCard.save();

    await board.save();

    res.status(200).json({
      message: 'Card added successfully',
      card: newCard,
    });
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a card
export const removeCard = async (req: CustomRequest, res: Response): Promise<void> => {
  const { cardId } = req.params;

  try {
    const board: IBoard | null = await Board.findOne({ userId: req.user._id });
    const column = board?.columns.find(col => col.cards.some(card => card._id.toString() === cardId));

    if (!column) {
      res.status(404).json({ message: 'Card not found' });
    }

    const cardIndex = column.cards.findIndex((card: ICard) => card._id.toString() === cardId);
    if (cardIndex !== -1) {
      column.cards.splice(cardIndex, 1); //removing
      await board?.save();
    }

    res.status(200).json({ message: 'Card removed successfully' });
  } catch (error) {
    console.error('Error removing card:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Move a card to a different column
export const moveCard = async (req: CustomRequest, res: Response): Promise<void> => {
  const { cardId, targetColumnId } = req.body;

  try {
    const board: IBoard | null = await Board.findOne({ userId: req.user._id });

    if (!board) {
      res.status(404).json({ message: 'Board not found' });
    }

    const sourceColumn = board.columns.find(col => col.cards.some(card => card._id.toString() === cardId));
    const targetColumn = board.columns.find(col => col._id.toString() === targetColumnId);

    if (!sourceColumn || !targetColumn) {
      res.status(404).json({ message: 'Source or Target column not found' });
    }

    const card = sourceColumn.cards.find((card: ICard) => card._id.toString() === cardId);
    if (!card) {
      res.status(404).json({ message: 'Card not found' });
    }

    //something
    const cardIndex = sourceColumn.cards.findIndex((card: ICard) => card._id.toString() === cardId);
    sourceColumn.cards.splice(cardIndex, 1);
    targetColumn.cards.push(card);

    await board.save();

    res.status(200).json({ message: 'Card moved successfully' });
  } catch (error) {
    console.error('Error moving card:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Rename a column
export const renameColumn = async (req: CustomRequest, res: Response): Promise<void> => {
  const { columnId } = req.params;
  const { name } = req.body;

  try {
    const board: IBoard | null = await Board.findOne({ userId: req.user._id });

    if (!board) {
      res.status(404).json({ message: 'Board not found' });
    }

    const column = board.columns.find(col => col._id.toString() === columnId); //array search

    if (!column) {
      res.status(404).json({ message: 'Column not found' });
    }

    column.name = name; // Rename column
    await board.save(); // Save board

    res.status(200).json({ message: 'Column renamed successfully', column });
  } catch (error) {
    console.error('Error renaming column:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
