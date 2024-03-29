import { FC, ReactChild, useEffect, useState } from "react";
import {
  GlobeIcon,
  DocumentReportIcon,
  CreditCardIcon,
  CogIcon,
} from "@heroicons/react/outline";

import type { User, Website } from "@prisma/client";

import AppNavigationMobile from "~/components/AppNavigationMobile";
import AppNavigationSide from "~/components/AppNavigationSide";
import AppNavigationTop from "~/components/AppNavigationTop";
import { useLocation } from "@remix-run/react";

export type NavigationItem = {
  name: string;
  href: string;
  icon: FC<any>;
  current: boolean;
};

type Navigation = {
  main: NavigationItem[];
  secondary: NavigationItem[];
};

type Props = {
  children: ReactChild;
  user: User;
  websites: Website[];
};

export default function AppContainer({ children, user, websites }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [navigation, setNavigation] = useState<Navigation>(() => {
    return {
      main: [
        {
          name: "Websites",
          href: "/app/websites",
          icon: GlobeIcon,
          current: false,
        },
        {
          name: "Dashboard",
          href: "/app/dashboard",
          icon: DocumentReportIcon,
          current: false,
        },
      ],
      secondary: [
        {
          name: "Plan",
          href: "/app/plan",
          icon: CreditCardIcon,
          current: false,
        },
        {
          name: "Settings",
          href: "/app/settings",
          icon: CogIcon,
          current: false,
        },
      ],
    };
  });

  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    setNavigation({
      main: navigation.main.map((page) => ({
        ...page,
        current: path.startsWith(page.href),
      })),
      secondary: navigation.secondary.map((page) => ({
        ...page,
        current: path.startsWith(page.href),
      })),
    });
  }, [path]);

  return (
    <div className="min-h-full bg-slate-50">
      <AppNavigationMobile
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
      />

      <AppNavigationSide navigation={navigation} />

      <div className="flex flex-1 flex-col lg:pl-48">
        <AppNavigationTop
          setSidebarOpen={setSidebarOpen}
          user={user}
          websites={websites}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
