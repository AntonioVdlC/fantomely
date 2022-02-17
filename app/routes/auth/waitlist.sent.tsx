import { Link, redirect, useSearchParams } from "remix";

import type { LoaderFunction } from "remix";

import { getUserId } from "~/utils/session.server";

import Logo from "~/components/Logo";

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
      <div className="flex justify-center motion-safe:animate-bounce">
        <Logo size="lg" withLink />
      </div>
      <div className="mt-6 px-4 text-center md:w-1/2">
        <p>Thanks you for joining the waitlist!</p>
        <p className="mt-3">
          We will send you an email to{" "}
          <span className="font-bold text-slate-700">
            {decodeURIComponent(searchParams.get("email") || "")}
          </span>{" "}
          to finish your registration once we open up to more users.
        </p>
      </div>
      <div className="mt-6">
        <Link to="/" className="text-base font-medium">
          Go back home<span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </>
  );
}
