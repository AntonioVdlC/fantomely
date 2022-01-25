import { ActionFunction, redirect } from "remix";
import { stripe } from "~/utils/stripe.server";

export const action: ActionFunction = async ({ request }) => {
  console.log("===== payment.create");
  const origin = new URL(request.url).origin;
  const { priceId } = await request.json();

  if (typeof priceId !== "string" || !priceId) {
    throw new Error("No priceId provided.");
  }

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: priceId,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${origin}/onboarding/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/onboarding/plan?canceled=true`,
  });

  if (!session?.url) {
    throw new Error("Failed to create a Checkout session.");
  }

  return redirect(session.url, 303);
};
