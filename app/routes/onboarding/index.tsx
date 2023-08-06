import { redirect } from "@remix-run/node";

import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  // TODO: check if user created via an invite
  // TODO: check how far the user has onboarded to redirect to the correct step
  // TODO: redirect to proper flow after beta
  return redirect("/onboarding/beta");
};
