import { Schema, model, Document, Types } from 'mongoose';
import { USER_ROLES, UserRole } from '@/constants/billing.constant';

export interface IUser extends Document {
  tenantId: Types.ObjectId;
  email: string;
  stripeCustomerId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    email: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'member',
    },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', UserSchema);
