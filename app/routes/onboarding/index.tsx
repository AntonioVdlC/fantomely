import { LoaderFunction, redirect } from "remix";

export const loader: LoaderFunction = async () => {
  // TODO: check if user created via an invite
  // TODO: check how far the user has onboarded to redirect to the correct step
  return redirect("/onboarding/org");
};