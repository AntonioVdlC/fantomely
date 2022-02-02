import type { LoaderFunction } from "remix";
import { Link, redirect, useSearchParams } from "remix";

import { getUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    // Redirect to the home page if they are already signed in.
    return redirect("/app");
  }

  return null;
};

export default function LoginSentRoute() {
  const [searchParams] = useSearchParams();

  return (
    <>
      <p>Thanks you for joining the waitlist!</p>
      <p>An email will be sent to {searchParams.get("email")}.</p>
    </>
  );
}
