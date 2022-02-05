import { Menu, Transition } from "@headlessui/react";
import {
  MenuAlt1Icon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/outline";
import { HomeIcon } from "@heroicons/react/solid";
import { User } from "@prisma/client";
import { Fragment } from "react";
import { Link } from "remix";
import classNames from "~/utils/class-names";

type Props = {
  setSidebarOpen: (val: boolean) => void;
  crumbs: Array<{ name: string; href: string; current: boolean }>;
  user: User;
};

export default function AppNavigationTop({
  setSidebarOpen,
  crumbs,
  user,
}: Props) {
  return (
    <div className="sticky top-0 bg-white z-10 shadow flex-shrink-0 flex h-16 lg:border-none">
      <button
        type="button"
        className="px-4 border-r border-slate-200 text-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 lg:hidden lg:border-transparent"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      {/* Search bar */}
      <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-6">
        <div className="flex-1 flex">
          {crumbs.length ? (
            <nav className="hidden sm:flex" aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-4">
                <li>
                  <div>
                    <Link
                      to="/app"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <HomeIcon
                        className="flex-shrink-0 h-5 w-5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Home</span>
                    </Link>
                  </div>
                </li>
                {crumbs.map((page) => (
                  <li key={page.name}>
                    <div className="flex items-center">
                      <ChevronRightIcon
                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <Link
                        to={page.href}
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                        aria-current={page.current ? "page" : undefined}
                      >
                        {page.name}
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          {/* Profile dropdown */}
          <Menu as="div" className="ml-3 relative">
            <div>
              <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 lg:p-2 lg:rounded-md lg:hover:bg-slate-50">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-500">
                  <span className="text-sm font-medium leading-none text-white">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </span>
                <span className="hidden ml-3 text-slate-700 text-sm font-medium lg:block">
                  <span className="sr-only">Open user menu for </span>
                  {user.firstName} {user.lastName}
                </span>
                <ChevronDownIcon
                  className="hidden flex-shrink-0 ml-1 h-5 w-5 text-slate-400 lg:block"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/app/user"
                      className={classNames(
                        active ? "bg-slate-100" : "",
                        "block px-4 py-2 text-sm text-slate-700"
                      )}
                    >
                      Your Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <form method="post" action="/auth/logout">
                      <button
                        type="submit"
                        className={classNames(
                          active ? "bg-slate-100" : "",
                          "block px-4 py-2 text-sm text-slate-700 w-full text-left"
                        )}
                      >
                        Logout
                      </button>
                    </form>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
