import mongoose, { Document, Schema } from 'mongoose';
import { ICard } from './Card';  // Import the Card interface

export interface IColumn extends Document {
  name: string;
  cards: ICard[];
}

const columnSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
      },
    ],
  },
  { timestamps: true }
);

const Column = mongoose.model<IColumn>('Column', columnSchema);

export default Column;

