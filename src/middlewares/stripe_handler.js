import stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeClient = stripe(stripeSecretKey);

export const stripeWebhookMiddleware = (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body;

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret);
  } catch (err) {
    console.error(`Error verifying webhook signature: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the Stripe webhook event
  req.stripeEvent = event;
  next();
};