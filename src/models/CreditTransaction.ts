import { Schema, model, Document, Types } from 'mongoose';
import { CREDIT_TRANSACTION_TYPES, CreditTransactionType } from '@/constants/billingConstants';

export interface ICreditTransaction extends Document {
  serviceSubscriptionId: Types.ObjectId;
  userId?: Types.ObjectId;
  type: CreditTransactionType;
  actionKey?: string;
  creditsDelta: number;
  balanceAfter: number;
  relatedStripeInvoice?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const CreditTransactionSchema = new Schema<ICreditTransaction>(
  {
    serviceSubscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceSubscription',
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: CREDIT_TRANSACTION_TYPES,
      required: true,
    },
    actionKey: { type: String },
    creditsDelta: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    relatedStripeInvoice: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const CreditTransaction = model<ICreditTransaction>(
  'CreditTransaction',
  CreditTransactionSchema,
);
