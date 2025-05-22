import { Schema, model, Document, Types } from 'mongoose';

export interface ICreditBalance extends Document {
  tenantId: Types.ObjectId;
  feature: string;
  balance: number;
}

const CreditBalanceSchema = new Schema<ICreditBalance>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    feature:  { type: String, required: true },
    balance:  { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const CreditBalance = model<ICreditBalance>(
  'CreditBalance',
  CreditBalanceSchema
);
