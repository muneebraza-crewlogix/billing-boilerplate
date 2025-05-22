// src/services/credit.service.ts
import { Types } from 'mongoose';
import { CreditBalance } from '@/models/CreditBalance';

export class CreditService {
  /** Fetch current balance for a tenant + feature */
  public async getBalance(tenantId: string, feature: string): Promise<number> {
    const doc = await CreditBalance.findOne({ tenantId, feature });
    return doc?.balance ?? 0;
  }

  /** Deduct credits; throws if insufficient */
  public async useCredits(
    tenantId: string,
    feature: string,
    amount: number
  ): Promise<void> {
    const doc = await CreditBalance.findOne({ tenantId, feature });
    if (!doc || doc.balance < amount) {
      throw new Error('Not enough credits');
    }
    doc.balance -= amount;
    await doc.save();
  }

  /** Add credits (e.g. on top‐up) */
  public async addCredits(
    tenantId: string,
    feature: string,
    amount: number
  ): Promise<void> {
    await CreditBalance.updateOne(
      { tenantId, feature },
      { $inc: { balance: amount } },
      { upsert: true }
    );
  }
}

export const creditService = new CreditService();