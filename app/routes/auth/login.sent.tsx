import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";

import Logo from "~/components/Logo";

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
      <div className="flex justify-center">
        <Logo size="lg" withLink />
      </div>
      <div className="mt-6">
        {searchParams.get("from") === "register" ? (
          <p>Thanks you for registering!</p>
        ) : null}
        <p>
          An email has been sent to{" "}
          <span className="font-bold text-slate-700">
            {decodeURIComponent(searchParams.get("email") || "")}
          </span>
          .
        </p>
        <p className="mt-3">
          Can't find the email? Try{" "}
          <Link
            to={`/auth/login?redirectTo=${searchParams.get("redirectTo")}`}
            className="font-medium text-slate-700 hover:text-slate-900"
          >
            signing in
          </Link>{" "}
          again!
        </p>
        <div className="mt-6">
          <Link to="/" className="text-base font-medium">
            Go back home<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </>
  );
}
