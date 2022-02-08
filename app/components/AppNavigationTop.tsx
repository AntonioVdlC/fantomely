import { MenuAlt1Icon } from "@heroicons/react/outline";
import { User, Website } from "@prisma/client";
import Breadcrumbs from "./Breadcrumbs";
import ProfileDropdown from "./ProfileDropdown";

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
    <div className="sticky top-0 bg-white z-20 flex-shrink-0 flex h-16">
      <button
        type="button"
        className="px-4 border-r border-slate-200 text-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 lg:hidden lg:border-transparent"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-between sm:px-6 lg:mx-auto lg:px-6">
        {/* TODO: make sure breadcrumbs don't overflow */}
        <div className="flex-1 flex">
          <Breadcrumbs websites={websites} />
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <ProfileDropdown user={user} />
        </div>
      </div>
    </div>
  );
}
