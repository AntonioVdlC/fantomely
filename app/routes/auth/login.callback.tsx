import { LoaderFunction, redirect } from "remix";
import { createUserSession, getUserId, login } from "~/utils/session.server";

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
    throw new Response("Error trying to log in.", { status: 400 });
  }

  const user = await login({ email, token });

  if (!user) {
    throw new Response("Error trying to log in.", { status: 404 });
  }

  if (!user.isOnboarded) {
    return createUserSession(user, "/auth/onboarding");
  }

  return createUserSession(user, redirectTo);
};

export default function LoginCallbackRoute() {
  return (
    <>
      <p>Signing you in ...</p>
    </>
  );
}
