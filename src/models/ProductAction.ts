import { Schema, model, Document, Types } from 'mongoose';

export interface IProductAction extends Document {
  productId: Types.ObjectId;
  actionKey: string;
  name: string;
  creditsCost: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductActionSchema = new Schema<IProductAction>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    actionKey: { type: String, required: true },
    name: { type: String, required: true },
    creditsCost: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const ProductAction = model<IProductAction>('ProductAction', ProductActionSchema);
