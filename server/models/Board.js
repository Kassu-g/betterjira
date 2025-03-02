const mongoose = require('mongoose');
const Column = require('./Column'); //link column model

const boardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  columns: [Column.schema], // column schema
});

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
