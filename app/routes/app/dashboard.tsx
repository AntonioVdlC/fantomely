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

type LoaderData = {
  websites: (Website & { pageViews: PageViewsItem })[];
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

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const hour = now.getUTCHours();

  return {
    websites: await Promise.all(
      websites.map(async (website) => {
        const value = { current: 0, previous: 0 };

        const currentPeriod = await db.period.findUnique({
          where: {
            period_website: {
              year,
              month,
              day,
              hour,
              websiteId: website.id,
            },
          },
        });
        if (currentPeriod) {
          const events = await db.event.findMany({
            where: { websiteId: website.id, periodId: currentPeriod.id },
          });

          value.current = events.reduce(
            (sum, event) => (sum += event.count),
            0
          );
        }

        const previousDate = new Date(now.getTime() - 60 * 60 * 1000);
        const previousYear = previousDate.getUTCFullYear();
        const previousMonth = previousDate.getUTCMonth() + 1;
        const previousDay = previousDate.getUTCDate();
        const previousHour = previousDate.getUTCHours();

        const previousPeriod = await db.period.findUnique({
          where: {
            period_website: {
              year: previousYear,
              month: previousMonth,
              day: previousDay,
              hour: previousHour,
              websiteId: website.id,
            },
          },
        });
        if (previousPeriod) {
          const events = await db.event.findMany({
            where: { websiteId: website.id, periodId: previousPeriod.id },
          });

          value.previous = events.reduce(
            (sum, event) => (sum += event.count),
            0
          );
        }

        const pageViews = {
          value,
          change: value.current - value.previous,
        };
        return { ...website, pageViews };
      })
    ),
  };
};

export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <div>
        <h2 className="text-slate-500 text-xs font-medium uppercase tracking-wide">
          Page Views (live)
        </h2>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.websites.map((website) => (
            <div
              key={website.id}
              className="relative bg-white pt-4 px-4 pb-[4.5rem] sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden flex"
            >
              <div
                className={classNames(
                  generateWebsiteColor(website.name),
                  "flex-shrink-0 flex items-center justify-center w-16 text-white text-2xl font-medium rounded-md shadow-sm"
                )}
              >
                {generateWebsiteInitials(website.name)}
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <dt>
                  <p className="ml-4 text-sm font-medium text-slate-500 truncate">
                    {website.name || website.url}
                  </p>
                </dt>
                <dd className="ml-4 flex items-center justify-between">
                  <p className="text-2xl font-semibold text-slate-900">
                    {website.pageViews.value.current}
                  </p>
                  <div
                    className={classNames(
                      website.pageViews.change > 0
                        ? "bg-green-100 text-green-800"
                        : website.pageViews.change < 0
                        ? "bg-red-100 text-red-800"
                        : "bg-slate-100 text-slate-800",
                      "inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0"
                    )}
                  >
                    {website.pageViews.change > 0 ? (
                      <ArrowSmUpIcon
                        className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
                        aria-hidden="true"
                      />
                    ) : website.pageViews.change < 0 ? (
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
                      {website.pageViews.change > 0
                        ? "Increased"
                        : website.pageViews.change < 0
                        ? "Decreased"
                        : "Stayed same"}{" "}
                      by
                    </span>
                    {Math.abs(website.pageViews.change)}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-slate-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <Link
                        to={`/app/dashboard/${website.id}`}
                        className="font-medium text-slate-600 hover:text-slate-500 block"
                      >
                        {" "}
                        View all
                        <span className="sr-only">
                          {" "}
                          {website.name || website.url} stats
                        </span>
                      </Link>
                    </div>
                  </div>
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
