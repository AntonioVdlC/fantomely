import type { User, Website } from "@prisma/client";

import { requireCurrentUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";

import AppContainer from "~/components/AppContainer";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";

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
