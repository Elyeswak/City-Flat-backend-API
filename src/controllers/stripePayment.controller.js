import Stripe from 'stripe';
import UserDb  from '../models/user.model.js';
import dotenv from 'dotenv';

/* Accessing .env content */
dotenv.config();

const stripe = new Stripe(process.env.SECRET_KEY, {
  apiVersion: '2020-08-27',
});


export async function createCustomer(foundUser) {
  if (foundUser.stripeCustomerID) {
    return foundUser.stripeCustomerID;
  }

  const customer = await stripe.customers.create({
    email: foundUser.email,
    metadata: {
      userId: foundUser._id,
    },
  });
 console.log("customer  , ", customer);

  foundUser.stripeCustomerID = customer.id;
  await foundUser.save();

  return customer.id;
}

export async function addCard(customerId, token) {
  const card = await stripe.customers.createSource(customerId, {
    source: token,
  });
 
  return card;
}

export async function createPaymentIntent(amount, customerId, paymentMethod) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      customer: customerId,
      payment_method: paymentMethod,
      off_session: true,
      confirm: true
    });

    return paymentIntent;
  } catch (err) {
    console.error(err.message);
    throw new Error(err.message);
  }
}

export async function httpMakePayment(req, res, amount, customerId, reservationId,tokenid) {
 

  try {
    const paymentIntent = await createPaymentIntent(
      amount * 100, // Stripe requires the amount to be in cents
      customerId,
      String(tokenid),
      {
        reservationId: reservationId,
      }
    );

    res.status(200).json({
       paymentIntent
      
    });
    return paymentIntent;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


export async function createCheckoutSession(
  customerId,
  reservation,
  paymentAmount
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId,
      client_reference_id: String(reservation._id),
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Reservation for ${reservation.appartment.name}`,
            },
            unit_amount: paymentAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    return session;
  } catch (error) {
    console.error(error.message);
    throw new Error(error);
  }
}