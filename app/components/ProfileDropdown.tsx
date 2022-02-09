import { Menu, Transition } from "@headlessui/react";
import { User } from "@prisma/client";
import { Fragment } from "react";
import classNames from "~/utils/class-names";
import UserLetterAvatar from "./USerLetterAvatar";

type Props = {
  user: User;
};

export default function ProfileDropdown({ user }: Props) {
  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ">
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
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
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
  );
}
