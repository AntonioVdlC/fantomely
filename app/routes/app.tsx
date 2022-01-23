import { LoaderFunction, Outlet, redirect } from "remix";
import { getUser, requireValidSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireValidSession(request);

  const user = await getUser(request);

  if (!user) {
    return redirect("/auth/login");
  }

  if (!user?.isOnboarded) {
    return redirect("/auth/onboarding");
  }

  return null;
};

export default function AppRoute() {
  return (
    <>
      <div>This is the app!</div>
      <form method="post" action="/auth/logout">
        <button type="submit">Logout</button>
      </form>
      <Outlet />
    </>
  );
}
