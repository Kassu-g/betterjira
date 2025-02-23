const mongoose = require('mongoose');
const Column = require('./Column'); // Reference to Column model

// Define the board schema
const boardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  columns: [Column.schema], // Reference columns defined in the Column model
});

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
