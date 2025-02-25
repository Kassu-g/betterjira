// Add a new column
exports.addColumn = async (req, res) => {
    const { name } = req.body;
    try {
      const board = await Board.findOne({ userId: req.user._id });
      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }
      const newColumn = {
        name,
        cards: [],
      };
      board.columns.push(newColumn);
      await board.save();
      res.status(200).json(newColumn);
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
      const columnIndex = board.columns.findIndex(col => col._id.toString() === columnId);
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
  
  // Add a card to a column
  exports.addCardToColumn = async (req, res) => {
    const { columnId } = req.params;
    const { title } = req.body;
    try {
      const board = await Board.findOne({ userId: req.user._id });
      const column = board.columns.id(columnId);
      if (!column) {
        return res.status(404).json({ message: 'Column not found' });
      }
      column.cards.push({ title });
      await board.save();
      res.status(200).json({ message: 'Card added successfully' });
    } catch (error) {
      console.error('Error adding card:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Remove a card
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
  
  // Move a card between columns
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
  