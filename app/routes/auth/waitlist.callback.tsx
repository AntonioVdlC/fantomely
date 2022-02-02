import type { LoaderFunction } from "remix";
import { redirect } from "remix";

import {
  createUserSession,
  getUserId,
  loginWaitlist,
} from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    // Redirect to the home page if they are already signed in.
    return redirect("/app");
  }

  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const token = url.searchParams.get("token");

  if (!email || !token) {
    throw new Response("Error trying to log in.", { status: 400 });
  }

  const user = await loginWaitlist({ email, token });

  if (!user) {
    throw new Response("Error trying to log in.", { status: 404 });
  }

  console.log(user);

  return createUserSession(user, "/onboarding");
};

export default function WaitlistCallbackRoute() {
  return (
    <>
      <p>Signing you in ...</p>
    </>
  );
}