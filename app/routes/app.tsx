import type { LoaderFunction } from "remix";
import { useLoaderData, useLocation, Outlet, redirect } from "remix";

import { requireCurrentUser } from "~/utils/session.server";

import { useEffect, useState } from "react";
import {
  CogIcon,
  CreditCardIcon,
  DocumentReportIcon,
  GlobeIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { User } from "@prisma/client";
import AppNavigationMobile from "~/components/AppNavigationMobile";
import AppNavigationSide from "~/components/AppNavigationSide";
import AppNavigationTop from "~/components/AppNavigationTop";

const navigation = [
  { name: "Home", href: "/app/", icon: HomeIcon, current: true },
  { name: "Websites", href: "/app/websites", icon: GlobeIcon, current: false },
  {
    name: "Dashboard",
    href: "/app/dashboard",
    icon: DocumentReportIcon,
    current: false,
  },
  { name: "Team", href: "/app/team", icon: UserGroupIcon, current: false },
];
const secondaryNavigation = [
  {
    name: "Billing",
    href: "/app/billing",
    icon: CreditCardIcon,
    current: false,
  },
  { name: "Settings", href: "/app/settings", icon: CogIcon, current: false },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [crumbs, setCrumbs] = useState<
    Array<{ name: string; href: string; current: boolean }>
  >([]);

  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    setCrumbs(pathToCrumbs(path));
  }, [path]);

  function pathToCrumbs(pathname: string) {
    const parts = pathname.replace("/app", "").split("/").filter(Boolean);
    const crumbs = [];

    let globalPath = "/app/";
    for (let i = 0, length = parts.length; i < length; i++) {
      const part = parts[i];
      globalPath += part;

      // TODO: get name for uuids
      const crumb = { name: part.toUpperCase(), href: globalPath };

      crumbs.push({ ...crumb, current: i === parts.length - 1 });
    }

    return crumbs;
  }

  return (
    <>
      <div className="min-h-full">
        <AppNavigationMobile
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
          secondaryNavigation={secondaryNavigation}
        />

        <AppNavigationSide
          navigation={navigation}
          secondaryNavigation={secondaryNavigation}
        />

        <div className="lg:pl-64 flex flex-col flex-1">
          <AppNavigationTop
            setSidebarOpen={setSidebarOpen}
            crumbs={crumbs}
            user={data.user}
          />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
