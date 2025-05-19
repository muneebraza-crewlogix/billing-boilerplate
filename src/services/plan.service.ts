import Stripe from 'stripe';
import { stripe } from '@/config/stripe';
import { Plan, IPlan } from '@/models/Plan';
import { Product } from '@/models/Product';

export interface CreatePlanDTO {
  productId: string;               // Mongo Product._id
  name: string;
  creditsIncluded: number;
  interval: 'month' | 'year' | 'one_off';
  overagePrice: number;
  costPerCredit: number;
  tenantPricePerCredit?: number;
  tierMetadata?: Record<string, any>;
}

export class PlanService {
  public async createPlan(dto: CreatePlanDTO): Promise<IPlan> {
    // 1️⃣ Load local Product
    const product = await Product.findById(dto.productId);
    if (!product) throw new Error('Product not found');

    // 2️⃣ Ensure Stripe Product exists
    let stripeProdId = product.metadata?.stripeProductId as string | undefined;
    if (!stripeProdId) {
      const sp = await stripe.products.create({
        name: dto.name,
        metadata: { localProductId: product.id }
      });
      stripeProdId = sp.id;
      product.metadata = { ...product.metadata, stripeProductId: sp.id };
      await product.save();
    }

    // 3️⃣ Create Stripe Price
    const unitAmount = Math.round(dto.costPerCredit * dto.creditsIncluded * 100);
    const priceParams: Stripe.PriceCreateParams = {
      unit_amount: unitAmount,
      currency: 'usd',
      product: stripeProdId
    };
    if (dto.interval !== 'one_off') {
      priceParams.recurring = { interval: dto.interval };
    }
    const stripePrice = await stripe.prices.create(priceParams);

    // 4️⃣ Persist Plan
    const plan = await Plan.create({
      productId: dto.productId,
      stripePriceId: stripePrice.id,
      name: dto.name,
      creditsIncluded: dto.creditsIncluded,
      interval: dto.interval,
      overagePrice: dto.overagePrice,
      costPerCredit: dto.costPerCredit,
      tenantPricePerCredit: dto.tenantPricePerCredit,
      tierMetadata: dto.tierMetadata
    });

    return plan;
  }

  public async listPlans(): Promise<IPlan[]> {
    return Plan.find().sort({ createdAt: -1 }).exec();
  }
}

export const planService = new PlanService();