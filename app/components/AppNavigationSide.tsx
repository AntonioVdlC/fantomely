import type { FC } from "react";
import classNames from "~/utils/class-names";
import Logo from "./Logo";

type Props = {
  navigation: Array<{
    name: string;
    href: string;
    icon: FC<any>;
    current: boolean;
  }>;
  secondaryNavigation: Array<{
    name: string;
    href: string;
    icon: FC<any>;
    current: boolean;
  }>;
};

export default function AppNavigationSide({
  navigation,
  secondaryNavigation,
}: Props) {
  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex flex-col flex-grow bg-white pt-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 bg-white">
          <Logo size="xs" withText />
        </div>
        <nav
          className="mt-4 pt-6 flex-1 flex flex-col divide-y divide-slate-800 overflow-y-auto bg-slate-700"
          aria-label="Sidebar"
        >
          <div className="px-2 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
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
              </a>
            ))}
          </div>
          <div className="mt-6 pt-6">
            <div className="px-2 space-y-1">
              {secondaryNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-slate-100 hover:text-white hover:bg-slate-600"
                >
                  <item.icon
                    className="mr-4 h-6 w-6 text-slate-200"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
