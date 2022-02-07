import classNames from "~/utils/class-names";
import Logo from "~/components/Logo";

import type { NavigationItem } from "~/components/AppContainer";
import { Link } from "remix";

type Props = {
  navigation: {
    main: NavigationItem[];
    secondary: NavigationItem[];
  };
};

export default function AppNavigationSide({ navigation }: Props) {
  return (
    <div className="hidden lg:flex lg:w-48 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white pt-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 bg-white">
          <Link to="/">
            <span className="sr-only">Landing Screen</span>
            <Logo size="xs" withText />
          </Link>
        </div>
        <nav
          className="mt-4 pt-6 flex-1 flex flex-col overflow-y-auto bg-slate-700"
          aria-label="Sidebar"
        >
          <div className="px-2 space-y-2">
            {navigation.main.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.current
                    ? "bg-slate-800 text-white"
                    : "text-slate-100 hover:text-white hover:bg-slate-600",
                  "group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                <item.icon
                  className="mr-4 flex-shrink-0 h-6 w-6 text-slate-200"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex-grow"></div>
          <div className="mt-6 pb-4">
            <div className="px-2 space-y-2">
              {navigation.secondary.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "bg-slate-800 text-white"
                      : "text-slate-100 hover:text-white hover:bg-slate-600",
                    "group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"
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
