import mongoose, { Document, Schema } from 'mongoose';

export interface ICard extends Document {
  title: string;  // Card title
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Card = mongoose.model<ICard>('Card', cardSchema);

export default Card; 
