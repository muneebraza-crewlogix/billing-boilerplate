import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  key: string;
  name: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Product = model<IProduct>('Product', ProductSchema);
