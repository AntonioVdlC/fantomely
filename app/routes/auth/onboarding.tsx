import type { ActionFunction, LoaderFunction } from "remix";
import { Form, redirect } from "remix";
import { db } from "~/utils/db.server";

import { getUser, requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  if (user.isOnboarded) {
    return redirect("/app");
  }

  return {};
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  try {
    await db.user.update({
      data: { isOnboarded: true },
      where: { id: userId },
    });
  } catch {
    throw new Response("Something went wrong trying to onboard user.", {
      status: 500,
    });
  }

  return redirect("/app");
};

export default function OnboardingRoute() {
  return (
    <>
      <p>Thanks for creating an account!</p>

      <p>Create an organisation</p>
      <Form method="post">
        {/* TODO: add language? */}
        {/* TODO: add terms? */}
        <button type="submit">Continue</button>
      </Form>
    </>
  );
}
