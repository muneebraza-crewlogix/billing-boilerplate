import { Schema, model, Document, Types } from 'mongoose';
import { PLAN_INTERVALS, PlanInterval } from '@/constants/billing.constant';

export interface IPlan extends Document {
  productId: Types.ObjectId;
  stripePriceId: string;
  name: string;
  creditsIncluded: number;
  interval: PlanInterval;
  overagePrice: number;
  costPerCredit: number;
  tenantPricePerCredit?: number;
  tierMetadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    stripePriceId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    creditsIncluded: { type: Number, required: true },
    interval: {
      type: String,
      enum: PLAN_INTERVALS,
      required: true,
    },
    overagePrice: { type: Number, required: true },
    costPerCredit: { type: Number, required: true },
    tenantPricePerCredit: { type: Number },
    tierMetadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Plan = model<IPlan>('Plan', PlanSchema);
