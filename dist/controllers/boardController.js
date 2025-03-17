"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameColumn = exports.moveCard = exports.removeCard = exports.addCardToColumn = exports.removeColumn = exports.getBoard = void 0;
const Board_1 = __importDefault(require("../models/Board"));
const Card_1 = __importDefault(require("../models/Card"));
// Get the user's board
const getBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const board = yield Board_1.default.findOne({ userId: req.user._id });
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
        }
        res.status(200).json(board);
    }
    catch (error) {
        console.error('Error fetching board:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getBoard = getBoard;
// Remove a column from the board
const removeColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { columnId } = req.params;
    try {
        const board = yield Board_1.default.findOne({ userId: req.user._id });
        const columnIndex = board === null || board === void 0 ? void 0 : board.columns.findIndex(col => col._id.toString() === columnId);
        if (columnIndex === undefined || columnIndex === -1) {
            res.status(404).json({ message: 'Column not found' });
        }
        board === null || board === void 0 ? void 0 : board.columns.splice(columnIndex, 1);
        yield (board === null || board === void 0 ? void 0 : board.save());
        res.status(200).json({ message: 'Column removed successfully' });
    }
    catch (error) {
        console.error('Error removing column:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.removeColumn = removeColumn;
// Add a new card to a column
const addCardToColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { columnId } = req.params;
    const { title } = req.body;
    if (!title) {
        res.status(400).json({ message: 'Card title is required' });
    }
    try {
        const board = yield Board_1.default.findOne({ userId: req.user._id });
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
        }
        const column = board.columns.find(col => col._id.toString() === columnId); // Use .find() to find column
        if (!column) {
            res.status(404).json({ message: 'Column not found' });
        }
        const newCard = new Card_1.default({ title });
        yield newCard.save();
        yield board.save();
        res.status(200).json({
            message: 'Card added successfully',
            card: newCard,
        });
    }
    catch (error) {
        console.error('Error adding card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addCardToColumn = addCardToColumn;
// Remove a card from a column
const removeCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cardId } = req.params;
    try {
        const board = yield Board_1.default.findOne({ userId: req.user._id });
        const column = board === null || board === void 0 ? void 0 : board.columns.find(col => col.cards.some(card => card._id.toString() === cardId));
        if (!column) {
            res.status(404).json({ message: 'Card not found' });
        }
        // Remove card manually from the column's cards array
        const cardIndex = column.cards.findIndex((card) => card._id.toString() === cardId);
        if (cardIndex !== -1) {
            column.cards.splice(cardIndex, 1); // Use .splice() to remove the card from the column
            yield (board === null || board === void 0 ? void 0 : board.save());
        }
        res.status(200).json({ message: 'Card removed successfully' });
    }
    catch (error) {
        console.error('Error removing card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.removeCard = removeCard;
// Move a card to a different column
const moveCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cardId, targetColumnId } = req.body;
    try {
        const board = yield Board_1.default.findOne({ userId: req.user._id });
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
        }
        const sourceColumn = board.columns.find(col => col.cards.some(card => card._id.toString() === cardId));
        const targetColumn = board.columns.find(col => col._id.toString() === targetColumnId);
        if (!sourceColumn || !targetColumn) {
            res.status(404).json({ message: 'Source or Target column not found' });
        }
        const card = sourceColumn.cards.find((card) => card._id.toString() === cardId);
        if (!card) {
            res.status(404).json({ message: 'Card not found' });
        }
        // Remove the card from the source column and add it to the target column
        const cardIndex = sourceColumn.cards.findIndex((card) => card._id.toString() === cardId);
        sourceColumn.cards.splice(cardIndex, 1); // Use .splice() to remove the card
        targetColumn.cards.push(card); // Add the card to the target column
        yield board.save(); // Save the board with the updated columns
        res.status(200).json({ message: 'Card moved successfully' });
    }
    catch (error) {
        console.error('Error moving card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.moveCard = moveCard;
// Rename a column
const renameColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { columnId } = req.params;
    const { name } = req.body;
    try {
        const board = yield Board_1.default.findOne({ userId: req.user._id });
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
        }
        const column = board.columns.find(col => col._id.toString() === columnId); // Use .find() for array search
        if (!column) {
            res.status(404).json({ message: 'Column not found' });
        }
        column.name = name; // Rename the column
        yield board.save(); // Save the updated board
        res.status(200).json({ message: 'Column renamed successfully', column });
    }
    catch (error) {
        console.error('Error renaming column:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.renameColumn = renameColumn;
