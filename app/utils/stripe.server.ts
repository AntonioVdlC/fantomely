import Stripe from "stripe";

if (
  typeof process.env.STRIPE_API_KEY !== "string" ||
  !process.env.STRIPE_API_KEY
) {
  throw new Error("No API key provided for Stripe.");
}

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2020-08-27",
});

export { stripe };
