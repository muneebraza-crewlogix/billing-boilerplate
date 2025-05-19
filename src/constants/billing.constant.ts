// -- Plan intervals --
export const PLAN_INTERVALS = ['month', 'year', 'one_off'] as const;
export type PlanInterval = typeof PLAN_INTERVALS[number];

// -- Subscription statuses --
export const SUBSCRIPTION_STATUSES = ['active', 'past_due', 'canceled'] as const;
export type SubscriptionStatus = typeof SUBSCRIPTION_STATUSES[number];

// -- Credit transaction types --
export const CREDIT_TRANSACTION_TYPES =
  ['CONSUMPTION', 'AUTO_RELOAD', 'OVERAGE', 'ADJUSTMENT'] as const;
export type CreditTransactionType =
  typeof CREDIT_TRANSACTION_TYPES[number];

// -- Invoice types & statuses --
export const INVOICE_TYPES = ['SUBSCRIPTION', 'AUTO_RELOAD', 'OVERAGE'] as const;
export type InvoiceType = typeof INVOICE_TYPES[number];

export const INVOICE_STATUSES = ['open', 'paid', 'failed', 'void'] as const;
export type InvoiceStatus = typeof INVOICE_STATUSES[number];

// -- Tenant types --
export const TENANT_TYPES = ['white-label'] as const;
export type TenantType = typeof TENANT_TYPES[number];

// -- User roles --
export const USER_ROLES = ['admin', 'member'] as const;
export type UserRole = typeof USER_ROLES[number];
