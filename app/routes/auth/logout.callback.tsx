import { Link } from "remix";

import Logo from "~/components/Logo";

export default function LogoutCallbackRouter() {
  return (
    <>
      <div className="flex animate-pulse justify-center">
        <Logo size="lg" withLink />
      </div>

      <p className="mt-6">Logged out successfully!</p>

      <div className="mt-6">
        <Link to="/" className="text-base font-medium">
          Go back home<span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </>
  );
}
