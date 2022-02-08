import { Website } from "@prisma/client";
import { Link, LoaderFunction, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";

import {
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  MinusSmIcon,
} from "@heroicons/react/outline";
import classNames from "~/utils/class-names";
import { generateWebsiteColor, generateWebsiteInitials } from "~/utils/website";

type PageViewsItem = {
  value: {
    current: number;
    previous: number;
  };
  change: number;
};

type PageViews = {
  hour: PageViewsItem;
  day: PageViewsItem;
  month: PageViewsItem;
};

type LoaderData = {
  websites: (Website & {
    pageViews: PageViews;
  })[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);
  const websites = await db.website.findMany({
    where: { orgId: user.currentOrg.id, isActive: true },
  });

  if (!websites.length) {
    return redirect("/app/websites");
  }

  if (websites.length === 1) {
    return redirect(`/app/dashboard/${websites[0].id}`);
  }

  const currentDate = new Date();
  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth() + 1;
  const day = currentDate.getUTCDate();
  const hour = currentDate.getUTCHours();

  return {
    websites: await Promise.all(
      websites.map(async (website) => {
        const pageViews = {} as PageViews;

        // Last hour
        {
          const value = { current: 0, previous: 0 };

          // Current
          const eventsCurrent = await db.event.findMany({
            where: {
              websiteId: website.id,
              period: { year, month, day, hour },
            },
          });

          value.current = eventsCurrent.reduce(
            (sum, event) => (sum += event.count),
            0
          );

          // Previous
          const previousDate = new Date(currentDate.getTime() - 60 * 60 * 1000);
          const previousYear = previousDate.getUTCFullYear();
          const previousMonth = previousDate.getUTCMonth() + 1;
          const previousDay = previousDate.getUTCDate();
          const previousHour = previousDate.getUTCHours();

          const events = await db.event.findMany({
            where: {
              websiteId: website.id,
              period: {
                year: previousYear,
                month: previousMonth,
                day: previousDay,
                hour: previousHour,
              },
            },
          });

          value.previous = events.reduce(
            (sum, event) => (sum += event.count),
            0
          );

          // Change
          const change = value.current - value.previous;

          pageViews.hour = {
            value,
            change,
          };
        }

        // Last day
        {
          const value = { current: 0, previous: 0 };

          // Current
          const eventsCurrent = await db.event.findMany({
            where: {
              websiteId: website.id,
              period: { year, month, day },
            },
          });

          value.current = eventsCurrent.reduce(
            (sum, event) => (sum += event.count),
            0
          );

          // Previous
          const previousDate = new Date(
            currentDate.getTime() - 24 * 60 * 60 * 1000
          );
          const previousYear = previousDate.getUTCFullYear();
          const previousMonth = previousDate.getUTCMonth() + 1;
          const previousDay = previousDate.getUTCDate();

          const events = await db.event.findMany({
            where: {
              websiteId: website.id,
              period: {
                year: previousYear,
                month: previousMonth,
                day: previousDay,
              },
            },
          });

          value.previous = events.reduce(
            (sum, event) => (sum += event.count),
            0
          );

          // Change
          const change = value.current - value.previous;

          pageViews.day = {
            value,
            change,
          };
        }

        // Last month
        {
          const value = { current: 0, previous: 0 };

          // Current
          const eventsCurrent = await db.event.findMany({
            where: {
              websiteId: website.id,
              period: { year, month },
            },
          });

          value.current = eventsCurrent.reduce(
            (sum, event) => (sum += event.count),
            0
          );

          // Previous
          const previousDate = new Date(
            currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
          );
          const previousYear = previousDate.getUTCFullYear();
          const previousMonth = previousDate.getUTCMonth() + 1;

          const events = await db.event.findMany({
            where: {
              websiteId: website.id,
              period: {
                year: previousYear,
                month: previousMonth,
              },
            },
          });

          value.previous = events.reduce(
            (sum, event) => (sum += event.count),
            0
          );

          // Change
          const change = value.current - value.previous;

          pageViews.month = {
            value,
            change,
          };
        }

        return { ...website, pageViews };
      })
    ),
  };
};

export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <div className="divide-y divide-slate-200">
        <div className="pb-6">
          <h2 className="text-slate-500 text-xs font-medium uppercase tracking-wide">
            Page Views (last hour)
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
            {data.websites.map((website) => (
              <div
                key={website.id}
                className="relative bg-white pt-4 px-4 pb-14 shadow rounded-lg overflow-hidden flex"
              >
                <div
                  className={classNames(
                    generateWebsiteColor(website.name),
                    "flex-shrink-0 flex items-center justify-center w-16 text-white text-2xl font-medium rounded-md shadow-sm"
                  )}
                >
                  {generateWebsiteInitials(website.name)}
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <dt>
                    <p className="ml-4 text-sm font-medium text-slate-500 truncate">
                      {website.name}
                    </p>
                  </dt>
                  <dd className="ml-4 flex items-center justify-between">
                    <p className="text-2xl font-semibold text-slate-900">
                      {website.pageViews.hour.value.current}
                    </p>
                    <div
                      className={classNames(
                        website.pageViews.hour.change > 0
                          ? "bg-green-100 text-green-800"
                          : website.pageViews.hour.change < 0
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-100 text-slate-800",
                        "inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0"
                      )}
                    >
                      {website.pageViews.hour.change > 0 ? (
                        <ArrowSmUpIcon
                          className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
                          aria-hidden="true"
                        />
                      ) : website.pageViews.hour.change < 0 ? (
                        <ArrowSmDownIcon
                          className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <MinusSmIcon
                          className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-slate-500"
                          aria-hidden="true"
                        />
                      )}

                      <span className="sr-only">
                        {website.pageViews.hour.change > 0
                          ? "Increased"
                          : website.pageViews.hour.change < 0
                          ? "Decreased"
                          : "Stayed same"}{" "}
                        by
                      </span>
                      {Math.abs(website.pageViews.hour.change)}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-slate-50 px-4 py-3">
                      <div className="text-sm">
                        <Link
                          to={`/app/dashboard/${website.id}`}
                          className="font-medium text-slate-600 hover:text-slate-500 block"
                        >
                          {" "}
                          View all
                          <span className="sr-only"> {website.name} stats</span>
                        </Link>
                      </div>
                    </div>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="py-6">
          <h2 className="text-slate-500 text-xs font-medium uppercase tracking-wide">
            Page Views (last day)
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
            {data.websites.map((website) => (
              <div
                key={website.id}
                className="relative bg-white pt-4 px-4 pb-14 shadow rounded-lg overflow-hidden flex"
              >
                <div
                  className={classNames(
                    generateWebsiteColor(website.name),
                    "flex-shrink-0 flex items-center justify-center w-16 text-white text-2xl font-medium rounded-md shadow-sm"
                  )}
                >
                  {generateWebsiteInitials(website.name)}
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <dt>
                    <p className="ml-4 text-sm font-medium text-slate-500 truncate">
                      {website.name}
                    </p>
                  </dt>
                  <dd className="ml-4 flex items-center justify-between">
                    <p className="text-2xl font-semibold text-slate-900">
                      {website.pageViews.day.value.current}
                    </p>
                    <div
                      className={classNames(
                        website.pageViews.day.change > 0
                          ? "bg-green-100 text-green-800"
                          : website.pageViews.day.change < 0
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-100 text-slate-800",
                        "inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0"
                      )}
                    >
                      {website.pageViews.day.change > 0 ? (
                        <ArrowSmUpIcon
                          className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
                          aria-hidden="true"
                        />
                      ) : website.pageViews.day.change < 0 ? (
                        <ArrowSmDownIcon
                          className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <MinusSmIcon
                          className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-slate-500"
                          aria-hidden="true"
                        />
                      )}

                      <span className="sr-only">
                        {website.pageViews.day.change > 0
                          ? "Increased"
                          : website.pageViews.day.change < 0
                          ? "Decreased"
                          : "Stayed same"}{" "}
                        by
                      </span>
                      {Math.abs(website.pageViews.day.change)}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-slate-50 px-4 py-3">
                      <div className="text-sm">
                        <Link
                          to={`/app/dashboard/${website.id}`}
                          className="font-medium text-slate-600 hover:text-slate-500 block"
                        >
                          {" "}
                          View all
                          <span className="sr-only"> {website.name} stats</span>
                        </Link>
                      </div>
                    </div>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="pt-6">
          <h2 className="text-slate-500 text-xs font-medium uppercase tracking-wide">
            Page Views (last 30 days)
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
            {data.websites.map((website) => (
              <div
                key={website.id}
                className="relative bg-white pt-4 px-4 pb-14 shadow rounded-lg overflow-hidden flex"
              >
                <div
                  className={classNames(
                    generateWebsiteColor(website.name),
                    "flex-shrink-0 flex items-center justify-center w-16 text-white text-2xl font-medium rounded-md shadow-sm"
                  )}
                >
                  {generateWebsiteInitials(website.name)}
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <dt>
                    <p className="ml-4 text-sm font-medium text-slate-500 truncate">
                      {website.name}
                    </p>
                  </dt>
                  <dd className="ml-4 flex items-center justify-between">
                    <p className="text-2xl font-semibold text-slate-900">
                      {website.pageViews.month.value.current}
                    </p>
                    <div
                      className={classNames(
                        website.pageViews.month.change > 0
                          ? "bg-green-100 text-green-800"
                          : website.pageViews.month.change < 0
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-100 text-slate-800",
                        "inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0"
                      )}
                    >
                      {website.pageViews.month.change > 0 ? (
                        <ArrowSmUpIcon
                          className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
                          aria-hidden="true"
                        />
                      ) : website.pageViews.month.change < 0 ? (
                        <ArrowSmDownIcon
                          className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <MinusSmIcon
                          className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-slate-500"
                          aria-hidden="true"
                        />
                      )}

                      <span className="sr-only">
                        {website.pageViews.month.change > 0
                          ? "Increased"
                          : website.pageViews.month.change < 0
                          ? "Decreased"
                          : "Stayed same"}{" "}
                        by
                      </span>
                      {Math.abs(website.pageViews.month.change)}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-slate-50 px-4 py-3">
                      <div className="text-sm">
                        <Link
                          to={`/app/dashboard/${website.id}`}
                          className="font-medium text-slate-600 hover:text-slate-500 block"
                        >
                          {" "}
                          View all
                          <span className="sr-only"> {website.name} stats</span>
                        </Link>
                      </div>
                    </div>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
