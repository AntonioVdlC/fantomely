import { redirect } from "@remix-run/node";

import type { LoaderFunction } from "@remix-run/node";
import { useCatch } from "@remix-run/react";

import ErrorPage from "~/components/ErrorPage";
import Loading from "~/components/Loading";

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
    throw new Response("Oops, we're missing some critical info!", {
      status: 400,
      statusText: "An email or token is missing.",
    });
  }

  const user = await loginWaitlist({
    email: decodeURIComponent(email),
    token,
  });

  if (!user) {
    throw new Response("Oops, we can't find you ...", {
      status: 404,
      statusText:
        "We couldn't find your account. The magic link has most likely expired.",
    });
  }

  return createUserSession(user, "/onboarding");
};

export default function WaitlistCallbackRoute() {
  return (
    <>
      <Loading text="Signing you in ..." />
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  const title = caught.data;
  const description = caught.statusText;

  return (
    <ErrorPage status={caught.status} title={title} description={description} />
  );
}
