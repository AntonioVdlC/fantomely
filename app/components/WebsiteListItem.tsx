import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";

import type { Website } from "@prisma/client";

import classNames from "~/utils/class-names";
import { generateWebsiteColor, generateWebsiteInitials } from "~/utils/website";
import { Link, Form } from "@remix-run/react";

type Props = {
  website: Website;
};

export default function WebsiteListItem({ website }: Props) {
  return (
    <div className="flex">
      <div
        className={classNames(
          generateWebsiteColor(website.name),
          "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-xl font-medium text-white shadow-sm"
        )}
      >
        {generateWebsiteInitials(website.name)}
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-slate-200 bg-white shadow-sm">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <Link
            to={`/app/websites/details/${website.id}`}
            className="block font-medium text-slate-900 hover:text-slate-600"
          >
            {website.name}
          </Link>

          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-slate-500 hover:text-slate-600 hover:underline"
          >
            {website.url}
          </a>
        </div>
        <div className="flex-shrink-0 pr-2"></div>
      </div>
      <Menu as="div" className="relative ml-1 inline-block text-left">
        <div>
          <Menu.Button className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent bg-white text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
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
          <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`/app/websites/details/${website.id}`}
                    className={classNames(
                      active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Details
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`/app/dashboard/${website.id}`}
                    className={classNames(
                      active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Dashboard
                  </Link>
                )}
              </Menu.Item>
              <Form method="post" action={`/app/websites/delete/${website.id}`}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="submit"
                      className={classNames(
                        active ? "bg-red-700 text-slate-100" : "text-red-700",
                        "block w-full px-4 py-2 text-left text-sm"
                      )}
                    >
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </Form>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
