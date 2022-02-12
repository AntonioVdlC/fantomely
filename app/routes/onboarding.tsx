import { Outlet, redirect } from "remix";

import type { LoaderFunction } from "remix";

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
      <div className="flex h-screen flex-col items-center justify-center overflow-hidden bg-slate-50">
        <Outlet />
      </div>
    </>
  );
}
