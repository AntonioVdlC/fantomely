import {
  GlobeIcon,
  DocumentReportIcon,
  UserGroupIcon,
  CreditCardIcon,
  CogIcon,
} from "@heroicons/react/outline";
import { User } from "@prisma/client";
import { FC, ReactChild, useEffect, useState } from "react";
import { useLocation } from "remix";
import AppNavigationMobile from "./AppNavigationMobile";
import AppNavigationSide from "./AppNavigationSide";
import AppNavigationTop from "./AppNavigationTop";

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
};

export default function AppContainer({ children, user }: Props) {
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
        {
          name: "Team",
          href: "/app/team",
          icon: UserGroupIcon,
          current: false,
        },
      ],
      secondary: [
        {
          name: "Billing",
          href: "/app/billing",
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

      <div className="lg:pl-48 flex flex-col flex-1">
        <AppNavigationTop setSidebarOpen={setSidebarOpen} user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
