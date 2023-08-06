import { redirect } from "@remix-run/node";

import type { LoaderFunction } from "@remix-run/node";

import { createUserSession, getUserId, login } from "~/utils/session.server";

import ErrorPage from "~/components/ErrorPage";
import Loading from "~/components/Loading";
import { useCatch } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    // Redirect to the home page if they are already signed in.
    return redirect("/app");
  }

  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const token = url.searchParams.get("token");
  const redirectTo = url.searchParams.get("redirectTo") || "/app";

  if (!email || !token) {
    throw new Response("Oops, we're missing some critical info!", {
      status: 400,
      statusText: "An email or token is missing.",
    });
  }

  const user = await login({ email: decodeURIComponent(email), token });

  if (!user) {
    throw new Response("Oops, we can't find you ...", {
      status: 404,
      statusText:
        "We couldn't find your account. The magic link has most likely expired.",
    });
  }

  if (!user.isOnboarded) {
    return createUserSession(user, "/onboarding");
  }

  return createUserSession(user, redirectTo);
};

export default function LoginCallbackRoute() {
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
    <ErrorPage
      status={caught.status}
      title={title}
      description={description}
      goToLink={{
        text: "Sign in again",
        href: "/auth/login",
      }}
    />
  );
}
