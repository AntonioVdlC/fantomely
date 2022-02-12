import { redirect } from "remix";

import type { LoaderFunction } from "remix";

import { getUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    // Redirect to the home page if they are already signed in.
    return redirect("/app");
  }

  // TODO: remove this redirect when not in private beta
  return redirect("/auth/waitlist");
};
