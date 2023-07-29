import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

import Button from "~/components/Button";
import Logo from "~/components/Logo";
import { Link } from "@remix-run/react";

type Props = {
  isUserLoggedIn: boolean;
};

export default function Header({ isUserLoggedIn }: Props) {
  const navigation = [
    { name: "About", href: "/about" },
    { name: "Docs", href: "/docs" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contribute", href: "/contribute" },
  ];

  return (
    <Popover
      as="header"
      className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-md"
    >
      <div className="py-4 md:py-6">
        <nav
          className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6"
          aria-label="Global"
        >
          <div className="flex flex-1 items-center">
            <div className="flex w-full items-center justify-between md:w-auto">
              <Logo withText withLink />
              <div className="-mr-2 flex items-center md:hidden">
                <Popover.Button className="focus-ring-inset inline-flex items-center justify-center rounded-md bg-slate-50 p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300">
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <div className="hidden space-x-8 md:ml-10 md:flex">
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
          className="absolute inset-x-0 top-0 z-10 origin-top transform p-2 transition md:hidden"
        >
          <div className="overflow-hidden rounded-lg bg-slate-50 shadow-md ring-1 ring-slate-300 ring-opacity-5">
            <div className="flex items-center justify-between px-5 pt-4">
              <div>
                <Logo withText withLink />
              </div>
              <div className="-mr-2">
                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-slate-50 p-2 text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-300">
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <div className="pb-6 pt-5">
              <div className="space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    to={item.href}
                    key={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-300"
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
