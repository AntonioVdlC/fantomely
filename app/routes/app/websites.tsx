import { Website } from "@prisma/client";
import { Form, LoaderFunction, useLoaderData, Link } from "remix";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";

import Button from "~/components/Button";
import classNames from "~/utils/class-names";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Input from "~/components/Input";

type LoaderData = {
  websites: Website[];
};

function generateWebsiteInitials(name: string | null) {
  if (!name) {
    return "A";
  }

  const parts = name.replace(/http(s)?:\/\//, "").split(".");
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  } else {
    return parts.slice(-2, -1)[0][0].toUpperCase();
  }
}

function generateWebsiteColor(name: string | null) {
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

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  const websites = await db.website.findMany({
    where: { orgId: user.currentOrg.id },
  });

  return {
    websites,
  };
};

export default function WebsitesRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <div>
        <h2 className="text-slate-500 text-xs font-medium uppercase tracking-wide">
          Existing Websites
        </h2>
        {data.websites.length ? (
          <ul
            role="list"
            className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6"
          >
            {data.websites.map((website) => (
              <li key={website.id} className="col-span-1 flex">
                <div
                  className={classNames(
                    generateWebsiteColor(website.name),
                    "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md shadow-sm"
                  )}
                >
                  {generateWebsiteInitials(website.name)}
                </div>
                <div className="flex-1 flex items-center justify-between border-t border-r border-b border-slate-200 bg-white rounded-r-md truncate shadow-sm">
                  <div className="flex-1 px-4 py-2 text-sm truncate">
                    <Link
                      to={`/app/websites/details/${website.id}`}
                      className="block text-slate-900 font-medium hover:text-slate-600"
                    >
                      {website.name || website.url}
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
                    <Menu.Button className="w-6 h-6 bg-white inline-flex items-center justify-center text-slate-400 rounded-full bg-transparent hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500">
                      <span className="sr-only">Open options</span>
                      <DotsVerticalIcon
                        className="h-5 w-5"
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
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/app/websites/details/${website.id}`}
                              className={classNames(
                                active
                                  ? "bg-slate-100 text-slate-900"
                                  : "text-slate-700",
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
                                active
                                  ? "bg-slate-100 text-slate-900"
                                  : "text-slate-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <form method="POST" action="#">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                type="submit"
                                className={classNames(
                                  active
                                    ? "text-slate-100 bg-red-700"
                                    : "text-red-700",
                                  "block w-full text-left px-4 py-2 text-sm"
                                )}
                              >
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </form>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm ">
            No websites tracked. Start by adding your first website!
          </p>
        )}
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-slate-500 text-xs font-medium uppercase tracking-wide">
          Add a new website
        </h2>

        <Form
          method="post"
          action="/app/websites/create"
          className="mt-3 space-y-4"
        >
          <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
            <Input
              type="text"
              id="name"
              name="name"
              label="Name"
              placeholder="Fantomely"
            />
            <Input
              type="text"
              id="url"
              name="url"
              label="Link"
              placeholder="https://fantomely.com"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
            <Button primary type="submit">
              Add website
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
