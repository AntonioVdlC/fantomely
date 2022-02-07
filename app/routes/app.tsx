import type { LoaderFunction } from "remix";
import { useLoaderData, Outlet, redirect } from "remix";
import { requireCurrentUser } from "~/utils/session.server";
import { User, Website } from "@prisma/client";
import AppContainer from "~/components/AppContainer";
import { db } from "~/utils/db.server";

type LoaderData = {
  user: User;
  websites: Website[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  if (!user) {
    return redirect("/auth/login");
  }

  if (!user?.isOnboarded) {
    return redirect("/onboarding");
  }

  const websites = await db.website.findMany({
    where: { orgId: user.currentOrg.id },
  });

  return {
    user,
    websites,
  };
};

export default function AppRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <AppContainer user={data.user} websites={data.websites}>
        <Outlet />
      </AppContainer>
    </>
  );
}
