const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
});
const Card = mongoose.model('Card', cardSchema);
module.exports = Card;
