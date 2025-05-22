// src/models/Tenant.ts
import { Schema, model, Document } from 'mongoose';
import {
  TENANT_TYPES,
  TenantType
} from '@/constants/billing.constant';

export interface ITenant extends Document {
  name: string;
  email: string;
  type: TenantType;
  stripeAccountId?: string;
  stripeCustomerId?: string;
  defaultReloadThreshold?: {
    percent?: number;
    absolute?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
    email: { type: String, required: false },
    type: {
      type: String,
      enum: TENANT_TYPES,
      required: true
    },
    stripeAccountId: { type: String },
    stripeCustomerId: { type: String },
    defaultReloadThreshold: {
      percent: { type: Number },
      absolute: { type: Number }
    }
  },
  { timestamps: true }
);

export const Tenant = model<ITenant>('Tenant', TenantSchema);
