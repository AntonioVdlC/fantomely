import type { LoaderFunction } from "remix";
import { Outlet, redirect } from "remix";

import { requireValidSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireValidSession(request);

  if (!user) {
    return redirect("/auth/login");
  }

  if (user.isOnboarded) {
    return redirect("/app");
  }

  return null;
};

export default function OnboardingRoute() {
  return (
    <>
      <div className="h-screen bg-slate-50 flex flex-col justify-center items-center overflow-hidden">
        <Outlet />
      </div>
    </>
  );
}
