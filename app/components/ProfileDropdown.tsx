import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import type { User } from "@prisma/client";

import classNames from "~/utils/class-names";

import UserLetterAvatar from "~/components/UserLetterAvatar";

type Props = {
  user: User;
};

export default function ProfileDropdown({ user }: Props) {
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ">
          <UserLetterAvatar user={user} />
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
        <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                    "block w-full px-4 py-2 text-left text-sm text-slate-700"
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
  );
}
