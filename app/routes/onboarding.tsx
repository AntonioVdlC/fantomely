import { LoaderFunction, Outlet, redirect } from "remix";
import { requireCurrentUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

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
      <div>This is the onboarding!</div>
      <Outlet />
    </>
  );
}
