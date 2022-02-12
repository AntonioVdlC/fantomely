import { MenuAlt1Icon } from "@heroicons/react/outline";

import type { User, Website } from "@prisma/client";

import Breadcrumbs from "~/components/Breadcrumbs";
import ProfileDropdown from "~/components/ProfileDropdown";

type Props = {
  setSidebarOpen: (val: boolean) => void;
  user: User;
  websites: Website[];
};

export default function AppNavigationTop({
  setSidebarOpen,
  user,
  websites,
}: Props) {
  return (
    <div className="sticky top-0 z-20 flex h-16 flex-shrink-0 bg-white">
      <button
        type="button"
        className="border-r border-slate-200 px-4 text-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 lg:hidden lg:border-transparent"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex flex-1 justify-between px-4 sm:px-6 lg:mx-auto lg:px-6">
        {/* TODO: make sure breadcrumbs don't overflow */}
        <div className="flex flex-1">
          <Breadcrumbs websites={websites} />
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <ProfileDropdown user={user} />
        </div>
      </div>
    </div>
  );
}
