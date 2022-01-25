import type { ActionFunction, LoaderFunction } from "remix";
import { Form, redirect, useLoaderData } from "remix";

import { Plan } from "@prisma/client";
import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";
import { fetch } from "@remix-run/node";

type LoaderData = {
  plans: Plan[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  if (user.isOnboarded) {
    return redirect("/app");
  }

  const plans = await db.plan.findMany({
    where: { isActive: true },
    orderBy: { priceValueInUSD: "asc" },
  });

  const data = { plans };

  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const origin = new URL(request.url).origin;

  const form = await request.formData();
  const plan = form.get("plan");

  console.log("==== plan", plan);

  return fetch(`${origin}/onboarding/payment/create`, {
    method: "POST",
    body: JSON.stringify({ priceId: plan }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default function OnboardingPlanRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <p>Thanks for creating an account!</p>

      <p>Choose a plan</p>
      <Form method="post">
        <fieldset>
          <legend className="sr-only">Chose a plan</legend>
          {data.plans.map((plan) => (
            <label key={plan.id}>
              <input
                type="radio"
                name="plan"
                value={plan.id}
                defaultChecked={plan.priceValueInUSD === 0}
              />{" "}
              {plan.name} -{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(plan.priceValueInUSD / 100)}
            </label>
          ))}
        </fieldset>
        <button type="submit">Confirm</button>
      </Form>
    </>
  );
}
