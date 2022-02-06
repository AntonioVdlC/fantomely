import type { LoaderFunction } from "remix";
import { useLoaderData, Outlet, redirect } from "remix";
import { requireCurrentUser } from "~/utils/session.server";
import { User } from "@prisma/client";
import AppContainer from "~/components/AppContainer";

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  if (!user) {
    return redirect("/auth/login");
  }

  if (!user?.isOnboarded) {
    return redirect("/onboarding");
  }

  return {
    user,
  };
};

export default function AppRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <AppContainer user={data.user}>
        <Outlet />
      </AppContainer>
    </>
  );
}
