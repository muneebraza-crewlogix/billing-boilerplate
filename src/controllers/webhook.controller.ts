import { Request, Response } from 'express';
import stripeLib from 'stripe';
import { Tenant } from '@/models/Tenant';

// Initialize Stripe with the secret key and API version.
// Casting 'apiVersion' to 'any' bypasses strict type enforcement from a custom SDK typing.
const stripe = new stripeLib(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil' as any
});

// Stripe webhook handler to process events sent by Stripe
export async function stripeWebhookHandler(req: Request, res: Response) {
  // Retrieve the Stripe signature from headers
  const sig = req.headers['stripe-signature']!;
  let evt: stripeLib.Event;

  // Verify the Stripe webhook signature and construct the event
  try {
    evt = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    // Handle errors from invalid signature or malformed event
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).send(`Webhook Error: ${message}`);

    return;
  }

  // Process the specific Stripe event: setup_intent.succeeded
  if (evt.type === 'setup_intent.succeeded') {
    const setup = evt.data.object as stripeLib.SetupIntent;

    // Extract payment method and customer ID from the event
    const pmId = setup.payment_method as string;
    const cusId = setup.customer as string;

    // Find the tenant in the database using Stripe customer ID and update default payment method
    const updatedTenant = await Tenant.findOneAndUpdate(
      { stripeCustomerId: cusId }, // Query filter
      { stripeDefaultPaymentMethodId: pmId }, // Fields to update
      { new: true } // Return the updated document
    );

    // If a tenant was found and updated, set this payment method as the default for future invoices in Stripe
    if (updatedTenant) {
      await stripe.customers.update(cusId, {
        invoice_settings: {
          default_payment_method: pmId
        }
      });
    }
  }

  // Send a success response to Stripe to acknowledge receipt
  res.json({ received: true });
}
