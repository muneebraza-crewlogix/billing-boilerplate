// src/services/tenantService.ts
import Stripe from 'stripe';
import { stripe } from '@/config/stripe';
import { Tenant, ITenant } from '@/models/Tenant';
import { TenantType } from '@/constants/billing.constant';

export interface OnboardTenantDTO {
  name: string;
  type: TenantType; // 'platform' | 'white-label'
  email: string; // for Stripe account creation
  reloadThreshold?: {
    percent?: number;
    absolute?: number;
  };
}

export class TenantService {
  /**
   * Creates a new Tenant record *and* a Stripe Connect account.
   */
  public async onboardTenant(dto: OnboardTenantDTO): Promise<ITenant> {
    const { name, type, email, reloadThreshold } = dto;

    // 1️⃣ Create a Stripe Connect account (Express for white-label, Standard otherwise)
    const account = await stripe.accounts.create({
      type: type === 'white-label' ? 'express' : 'standard',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // 2️⃣ Persist Tenant in MongoDB
    const tenant = await Tenant.create({
      name,
      type,
      stripeAccountId: account.id,
      defaultReloadThreshold: reloadThreshold,
    });

    return tenant;
  }

  /**
   * Creates/attaches a Stripe Customer (in the tenant's Connect account context)
   * and saves its ID on the Tenant record.
   */
  public async attachPaymentMethod(
    tenantId: string,
    email: string,
    paymentMethodId: string,
  ): Promise<Stripe.Customer> {
    // 1️⃣ Fetch Tenant
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // 2️⃣ Prepare Stripe options for connected account
    const stripeOpts: Stripe.RequestOptions = tenant.stripeAccountId
      ? { stripeAccount: tenant.stripeAccountId }
      : {};

    // 3️⃣ Create or retrieve Customer in that account
    const customer = await stripe.customers.create(
      {
        email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      },
      stripeOpts,
    );

    // 4️⃣ Persist the Customer ID
    tenant.stripeCustomerId = customer.id;
    await tenant.save();

    return customer;
  }
}

export const tenantService = new TenantService();
