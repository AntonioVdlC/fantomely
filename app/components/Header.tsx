import { Fragment } from "react";

import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

import { Link } from "remix";

import Button from "~/components/Button";
import Logo from "~/components/Logo";

type Props = {
  navigation: Array<{ name: string; href: string }>;
  isUserLoggedIn: boolean;
};

export default function Header({ navigation, isUserLoggedIn }: Props) {
  return (
    <Popover
      as="header"
      className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10"
    >
      <div className="py-6">
        <nav
          className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6"
          aria-label="Global"
        >
          <div className="flex items-center flex-1">
            <div className="flex items-center justify-between w-full md:w-auto">
              <Logo withText withLink />
              <div className="-mr-2 flex items-center md:hidden">
                <Popover.Button className="bg-slate-50 rounded-md p-2 inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-slate-300">
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <div className="hidden space-x-8 md:flex md:ml-10">
              {navigation.map((item) => (
                <Link
                  to={item.href}
                  key={item.name}
                  className="text-base font-medium text-slate-700 hover:text-slate-900"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            {isUserLoggedIn ? (
              <Button to="/app" primary>
                Go to app
              </Button>
            ) : (
              <>
                <Button to="/auth/login" secondary>
                  Sign in
                </Button>
                <Button to="/auth/register" primary>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>

      <Transition
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top md:hidden"
        >
          <div className="rounded-lg shadow-md bg-slate-50 ring-1 ring-slate-300 ring-opacity-5 overflow-hidden">
            <div className="px-5 pt-4 flex items-center justify-between">
              <div>
                <Logo withText withLink />
              </div>
              <div className="-mr-2">
                <Popover.Button className="bg-slate-50 rounded-md p-2 inline-flex items-center justify-center text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-300">
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <div className="pt-5 pb-6">
              <div className="px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    to={item.href}
                    key={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-300"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              {isUserLoggedIn ? (
                <div className="mt-6 px-5">
                  <Button to="/app" primary>
                    Go to app
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mt-6 px-5">
                    <Button to="/auth/register" primary>
                      Sign up
                    </Button>
                  </div>
                  <div className="mt-6 px-5">
                    <p className="text-center text-base font-medium text-slate-500">
                      Existing customer?{" "}
                      <Link
                        to="/auth/login"
                        className="text-slate-900 hover:underline"
                      >
                        Sign in
                      </Link>{" "}
                      instead.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
