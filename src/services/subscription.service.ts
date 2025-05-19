import Stripe from 'stripe';
import { stripe } from '@/config/stripe';
import { ServiceSubscription, IServiceSubscription } from '@/models/ServiceSubscription';
import { Tenant } from '@/models/Tenant';
import { Plan } from '@/models/Plan';

export interface CreateSubscriptionDTO {
  tenantId: string;
  planId: string;
}

export class SubscriptionService {
  public async createSubscription(dto: CreateSubscriptionDTO): Promise<IServiceSubscription> {
    const { tenantId, planId } = dto;

    // 1️⃣ Load tenant & plan
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) throw new Error('Tenant not found');

    const plan = await Plan.findById(planId);
    if (!plan) throw new Error('Plan not found');

    if (!tenant.stripeCustomerId) {
      throw new Error('Tenant has no Stripe customer attached');
    }

    // 2️⃣ Create Stripe subscription in connected account
    const stripeOpts: Stripe.RequestOptions = { stripeAccount: tenant.stripeAccountId! };
    const subscription = await stripe.subscriptions.create(
      {
        customer: tenant.stripeCustomerId,
        items: [{ price: plan.stripePriceId }],
      },
      stripeOpts
    );

    console.log(subscription);

    const periodEnd = (subscription as any).current_period_end!

    // 3️⃣ Persist to Mongo
    const serviceSub = await ServiceSubscription.create({
      tenantId,
      planId,
      productId: plan.productId,
      stripeSubscriptionId: subscription.id,
      creditBalance: plan.creditsIncluded,
      nextBillingDate: new Date(periodEnd * 1000),
      status: subscription.status as any,
    });

    return serviceSub;
  }
}

export const subscriptionService = new SubscriptionService();
