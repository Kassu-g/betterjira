const Board = require('../models/Board');

// Create a new board for the authenticated user
exports.createBoard = async (req, res) => {
  const { user } = req;
  try {
    const board = new Board({ userId: user._id, columns: [] });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: 'Error creating board' });
  }
};

// Get the user's board
exports.getBoard = async (req, res) => {
  const { user } = req;
  try {
    const board = await Board.findOne({ userId: user._id });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching board' });
  }
};
