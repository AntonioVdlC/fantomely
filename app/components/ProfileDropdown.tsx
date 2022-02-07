import { Menu, Transition } from "@headlessui/react";
import { User } from "@prisma/client";
import { Fragment } from "react";
import classNames from "~/utils/class-names";

type Props = {
  user: User;
};

function generateAvatarColor(user: User | undefined) {
  const name = user?.firstName?.concat?.(user?.lastName || "") || "";

  if (!name) {
    return "bg-slate-600";
  }

  const colors = [
    "bg-slate-600",
    "bg-slate-600",
    "bg-zinc-600",
    "bg-stone-600",
    "bg-red-600",
    "bg-orange-600",
    "bg-amber-600",
    "bg-yellow-600",
    "bg-lime-600",
    "bg-green-600",
    "bg-emerald-600",
    "bg-teal-600",
    "bg-cyan-600",
    "bg-sky-600",
    "bg-blue-600",
    "bg-indigo-600",
    "bg-violet-600",
    "bg-purple-600",
    "bg-fuschia-600",
    "bg-pink-600",
    "bg-rose-600",
  ];

  // We select an index based on the name of the website
  const colorIndex =
    name
      .toLowerCase()
      .split("")
      .filter((l) => l.charCodeAt(0) > 96)
      .map((l) => l.charCodeAt(0) - 96)
      .reduce((sum, val) => sum + val, 0) % colors.length;

  return colors[colorIndex];
}

export default function ProfileDropdown({ user }: Props) {
  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ">
          <span
            className={classNames(
              generateAvatarColor(user),
              "inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-500"
            )}
          >
            <span className="text-sm font-medium leading-none text-white">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </span>
          </span>
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
