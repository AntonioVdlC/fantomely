import classNames from "~/utils/class-names";

import Logo from "~/components/Logo";

import type { NavigationItem } from "~/components/AppContainer";
import { Link } from "@remix-run/react";

type Props = {
  navigation: {
    main: NavigationItem[];
    secondary: NavigationItem[];
  };
};

export default function AppNavigationSide({ navigation }: Props) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-48 lg:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto bg-white pt-4">
        <div className="flex flex-shrink-0 items-center bg-white px-4">
          <Link to="/">
            <span className="sr-only">Landing Screen</span>
            <Logo size="xs" withText />
          </Link>
        </div>
        <nav
          className="mt-4 flex flex-1 flex-col overflow-y-auto bg-slate-700 pt-6"
          aria-label="Sidebar"
        >
          <div className="space-y-2 px-2">
            {navigation.main.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.current
                    ? "bg-slate-800 text-white"
                    : "text-slate-100 hover:bg-slate-600 hover:text-white",
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                <item.icon
                  className="mr-4 h-6 w-6 flex-shrink-0 text-slate-200"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex-grow"></div>
          <div className="mt-6 pb-4">
            <div className="space-y-2 px-2">
              {navigation.secondary.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "bg-slate-800 text-white"
                      : "text-slate-100 hover:bg-slate-600 hover:text-white",
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  <item.icon
                    className="mr-4 h-6 w-6 text-slate-200"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
