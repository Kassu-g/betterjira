const mongoose = require('mongoose');

// Define the column schema
const columnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
  }],
});

const Column = mongoose.model('Column', columnSchema);
module.exports = Column;
