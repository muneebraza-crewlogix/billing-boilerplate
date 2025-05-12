import { Schema, model, Document, Types } from 'mongoose';
import {
  INVOICE_TYPES,
  InvoiceType,
  INVOICE_STATUSES,
  InvoiceStatus,
} from '@/constants/billing.constant';

interface LineItem {
  planId: Types.ObjectId;
  description: string;
  quantity: number;
  unitAmount: number;
}

const LineItemSchema = new Schema<LineItem>(
  {
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitAmount: { type: Number, required: true },
  },
  { _id: false },
);

export interface IInvoice extends Document {
  tenantId: Types.ObjectId;
  userId?: Types.ObjectId;
  serviceSubscriptionId: Types.ObjectId;
  stripeInvoiceId: string;
  invoiceType: InvoiceType;
  amountDue: number;
  amountPaid: number;
  currency: string;
  invoiceDate: Date;
  dueDate?: Date;
  status: InvoiceStatus;
  lineItems: LineItem[];
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    serviceSubscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceSubscription',
      required: true,
    },
    stripeInvoiceId: { type: String, required: true, unique: true },
    invoiceType: {
      type: String,
      enum: INVOICE_TYPES,
      required: true,
    },
    amountDue: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    currency: { type: String, required: true },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: INVOICE_STATUSES,
      required: true,
    },
    lineItems: { type: [LineItemSchema], required: true },
  },
  { timestamps: true },
);

export const Invoice = model<IInvoice>('Invoice', InvoiceSchema);
