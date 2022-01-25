import { LoaderFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";
import { stripe } from "~/utils/stripe.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    throw new Error("No session id provided.");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session) {
    throw new Error("No session found");
  }

  if (!session.customer) {
    throw new Error("Session has no customer");
  }
  if (!session.subscription) {
    throw new Error("Session has no subscription");
  }

  const customer = await stripe.customers.retrieve(session.customer.toString());
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription.toString()
  );
  const priceId = subscription.items.data[0].price.id;
  const plan = await db.plan.findUnique({ where: { stripePriceId: priceId } });

  // TODO: save customer and subscription ids ... in Subscription table

  if (!plan) {
    throw new Error("No plan found");
  }

  if (plan.includeUsersMax > 1) {
    return redirect("/onboarding/invite");
  } else {
    await db.user.update({
      data: { isOnboarded: true },
      where: { id: user.id },
    });

    return redirect("/app");
  }
};

export default function OnboardingPaymentSuccess() {
  return (
    <>
      <div>TODO: payment successful</div>
      <form method="POST">
        <button type="submit">Continue</button>
      </form>
    </>
  );
}
