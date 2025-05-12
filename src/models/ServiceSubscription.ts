import { Schema, model, Document, Types } from 'mongoose';
import { SUBSCRIPTION_STATUSES, SubscriptionStatus } from '@/constants/billingConstants';

export interface IServiceSubscription extends Document {
  tenantId: Types.ObjectId;
  planId: Types.ObjectId;
  productId: Types.ObjectId;
  stripeSubscriptionId: string;
  creditBalance: number;
  autoReloadThreshold?: {
    percent?: number;
    absolute?: number;
  };
  actionCosts?: Record<string, number>;
  status: SubscriptionStatus;
  nextBillingDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSubscriptionSchema = new Schema<IServiceSubscription>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    creditBalance: { type: Number, required: true },
    autoReloadThreshold: {
      percent: { type: Number },
      absolute: { type: Number },
    },
    actionCosts: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: SUBSCRIPTION_STATUSES,
      default: 'active',
    },
    nextBillingDate: { type: Date },
  },
  { timestamps: true },
);

export const ServiceSubscription = model<IServiceSubscription>(
  'ServiceSubscription',
  ServiceSubscriptionSchema,
);
