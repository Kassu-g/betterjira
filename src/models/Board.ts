import mongoose, { Schema, Document } from 'mongoose';

export interface ICard {
  _id: any;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IColumn {
  _id: any;
  name: string;
  cards: ICard[];
}

export interface IBoard extends Document {
  userId: string;
  columns: IColumn[];
}

const cardSchema = new Schema<ICard>({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const columnSchema = new Schema<IColumn>({
  name: { type: String, required: true },
  cards: [cardSchema],
});

const boardSchema = new Schema<IBoard>({
  userId: { type: String, required: true },
  columns: [columnSchema],
});

const Board = mongoose.model<IBoard>('Board', boardSchema);

export default Board;
