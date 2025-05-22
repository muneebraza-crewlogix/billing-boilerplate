// src/services/tenantService.ts
import Stripe from 'stripe';
import { stripe } from '@/config/stripe';
import { Tenant, ITenant } from '@/models/Tenant';
import { TenantType, TenantTypeEnum } from '@/constants/billing.constant';
import { config } from '@/config';
import { CreditBalance } from '@/models/CreditBalance';

export interface OnboardTenantDTO {
  name: string;
  email: string;
  type: TenantType;
  reloadThreshold?: {
    percent?: number;
    absolute?: number;
  };
}

export class TenantService {
  public async onboardTenant(dto: OnboardTenantDTO): Promise<ITenant> {
    const { name, type, reloadThreshold } = dto;

    let tenant;

    // ── Phase 1: trial sandbox ───────────────────────────────────
    if (type === TenantTypeEnum.Trial) {
      // 1) create only the DB record
      tenant = new Tenant({ name, type, defaultReloadThreshold: reloadThreshold });
      await tenant.save();

      // 2) seed some free credits
      const freebies = [
        { tenantId: tenant._id, feature: 'super-search', balance: 100 },
        { tenantId: tenant._id, feature: 'api-credits', balance: 50 },
      ];
      await CreditBalance.insertMany(freebies);

      // 3) return the tenant record (no Stripe URL)
      return tenant.toObject();
    }

    return tenant!.toObject();
    // ── Phases 2+3: paid flow (capture card, then Connect onboarding) ─────────────────
    // (your existing stripe.accounts.create / account link logic goes here)
    // ...
  }

  /** Create—or retrieve—your Stripe Customer and issue a SetupIntent */
  public async createSetupIntent(tenantId: string): Promise<string> {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) throw new Error('Tenant not found');

    // 1) create Stripe Customer only once
    if (!tenant.stripeCustomerId) {
      const cus = await stripe.customers.create({ metadata: { tenantId } });
      tenant.stripeCustomerId = cus.id;
      await tenant.save();
    }

    // 2) issue a SetupIntent for off-session card capture
    const setup = await stripe.setupIntents.create({
      customer: tenant.stripeCustomerId,
      usage:    'off_session'
    });

    return setup.client_secret!;
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

  public async createPayoutOnboardingLink(tenantId: string): Promise<string> {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) throw new Error('Tenant not found');

    // 1) Lazy-create Connect account
    if (!tenant.stripeAccountId) {
      const acct = await stripe.accounts.create({
        type:          'express',
        email:         tenant.email,       // collect on signup or later
        business_type: 'company',
        // …any prefilled business_profile / settings…
      });
      tenant.stripeAccountId = acct.id;
      await tenant.save();
    }

    // 2) Create an AccountLink with only the fields still due
    const link = await stripe.accountLinks.create({
      account:     tenant.stripeAccountId,
      refresh_url: `${config.appUrl}/billing/tenants/${tenantId}/onboard/refresh`,
      return_url:  `${config.appUrl}/billing/tenants/${tenantId}/onboard/success`,
      type:        'account_onboarding',
      collect:     'eventually_due'
    });

    return link.url!;
  }
}

export const tenantService = new TenantService();
