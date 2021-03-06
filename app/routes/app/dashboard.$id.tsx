import { useEffect, useState } from "react";
import { Link, redirect, useLoaderData, useNavigate } from "remix";

import type { LoaderFunction } from "remix";
import type {
  Browser,
  Event,
  Path,
  Period,
  Platform,
  Referrer,
  Website,
} from "@prisma/client";

import { db } from "~/utils/db.server";
import {
  generateRandomString,
  requireCurrentUser,
} from "~/utils/session.server";
import classNames from "~/utils/class-names";
import { generateWebsiteColor, generateWebsiteInitials } from "~/utils/website";

import BarChart from "~/components/BarChart.client";
import BrushChart from "~/components/BrushChart.client";
import Button from "~/components/Button";
import H2 from "~/components/SectionHeader";
import LayoutGrid from "~/components/LayoutGrid";
import Loading from "~/components/Loading";

import illustration from "~/assets/illustration_dashboard_empty.svg";

type DashboardElement = {
  id: string;
  value: string | number;
  count: number;
};

type LoaderData = {
  website: Website;
  events: (Event & {
    path: Path;
    period: Period;
    browser?: Browser;
    platform?: Platform;
  })[];
  element: Path | Browser | Platform | Referrer | undefined;
  paths: DashboardElement[];
  periods: DashboardElement[];
  browsers: DashboardElement[];
  platforms: DashboardElement[];
  referrers: DashboardElement[];
};

type ElementKey = "path" | "browser" | "platform" | "referrer" | undefined;

export const loader: LoaderFunction = async ({ request, params }) => {
  const { searchParams } = new URL(request.url);
  const websiteId = params.id;
  const el: ElementKey =
    searchParams.get("el") &&
    ["path", "browser", "platform", "referrer"].includes(
      searchParams.get("el")?.toString() ?? ""
    )
      ? (searchParams.get("el") as ElementKey)
      : undefined;
  const elId = searchParams.get("elId");

  if (!websiteId) {
    return redirect("/app/");
  }

  const user = await requireCurrentUser(request);
  const website = await db.website.findFirst({
    where: { id: websiteId, orgId: user.currentOrg.id },
  });
  if (!website) {
    throw new Response("Website not found", { status: 404 });
  }

  let where = { websiteId: website.id };
  if (el && ["path", "browser", "platform", "referrer"].includes(el) && elId) {
    where = { ...where, [`${el}Id`]: elId };
  }

  const events = await db.event.findMany({
    where,
    include: {
      path: true,
      period: true,
      browser: true,
      platform: true,
      referrer: true,
    },
    orderBy: { period: { createdAt: "asc" } },
  });

  let element;
  if (el && ["path", "browser", "platform", "referrer"].includes(el) && elId) {
    const event = events.find((event) => Boolean(event[el]));
    if (event) {
      element = event[el];
    }
  }

  const paths: DashboardElement[] = [];
  const periods: (DashboardElement & {
    year: number;
    month: number;
    day: number;
  })[] = [];
  const filledPeriods: DashboardElement[] = [];
  const browsers: DashboardElement[] = [];
  const platforms: DashboardElement[] = [];
  const referrers: DashboardElement[] = [];
  events.forEach((event) => {
    const path = paths.find((path) => path.id === event.pathId);
    if (path) {
      path.count += event.count;
    } else {
      paths.push({
        id: event.pathId,
        value: event.path.value.replace(website.url, ""),
        count: event.count,
      });
    }

    const period = periods.find(
      (period) =>
        period.year === event.period.year &&
        period.month === event.period.month &&
        period.day === event.period.day
    );
    if (period) {
      period.count += event.count;
    } else {
      periods.push({
        id: event.periodId,
        value: Date.UTC(
          event.period.year,
          event.period.month - 1,
          event.period.day
        ),
        year: event.period.year,
        month: event.period.month,
        day: event.period.day,
        count: event.count,
      });
    }

    if (event.browser) {
      const browser = browsers.find(
        (browser) => browser.id === event.browser?.id
      );
      if (browser) {
        browser.count += event.count;
      } else {
        browsers.push({
          id: event.browser.id,
          value: event.browser.value,
          count: event.count,
        });
      }
    }

    if (event.platform) {
      const platform = platforms.find(
        (platform) => platform.id === event.platform?.id
      );
      if (platform) {
        platform.count += event.count;
      } else {
        platforms.push({
          id: event.platform.id,
          value: event.platform.value,
          count: event.count,
        });
      }
    }

    if (event.referrer) {
      const referrer = referrers.find(
        (referrer) => referrer.id === event.referrer?.id
      );
      if (referrer) {
        referrer.count += event.count;
      } else {
        referrers.push({
          id: event.referrer.id,
          value: event.referrer.value,
          count: event.count,
        });
      }
    }
  });

  if (periods.length) {
    for (
      let i = 0, date = periods[0].value as number;
      i < periods.length || date < Date.now();
      date += 24 * 60 * 60 * 1000
    ) {
      if (periods[i]?.value === date) {
        filledPeriods.push({
          id: periods[i].id,
          value: periods[i].value,
          count: periods[i].count,
        });
        i++;
        continue;
      }
      filledPeriods.push({
        id: generateRandomString(8),
        value: date,
        count: 0,
      });
    }
  }

  return {
    website,
    events,
    element,
    paths,
    periods: filledPeriods,
    platforms,
    browsers,
    referrers,
  };
};

export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>();

  const [isMounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const navigate = useNavigate();

  return data.periods.length ? (
    <>
      <H2>Dashboard for {data.website.name}</H2>
      <div className="mt-3"></div>
      <LayoutGrid>
        <div>
          <div className="mt-1 flex">
            <div
              className={classNames(
                generateWebsiteColor(data.website.name),
                "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-xl font-medium text-white shadow-sm"
              )}
            >
              {generateWebsiteInitials(data.website.name)}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-slate-200 bg-white shadow-sm">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <Link
                  to={`/app/websites/details/${data.website.id}`}
                  className="block font-medium text-slate-900 hover:text-slate-600"
                >
                  {data.website.name}
                </Link>

                <a
                  href={data.website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-slate-500 hover:text-slate-600 hover:underline"
                >
                  {data.website.url}
                </a>
              </div>
              <div className="flex-shrink-0 pr-2"></div>
            </div>
          </div>
        </div>

        {data.element?.value ? (
          <div>
            <H2>Viewing subset for</H2>
            <p className="mt-1">{data.element.value}</p>
          </div>
        ) : (
          <div></div>
        )}

        {data.element?.value ? (
          <div>
            <Button secondary to={`/app/dashboard/${data.website.id}`}>
              Back to overview
            </Button>
          </div>
        ) : (
          <div></div>
        )}
      </LayoutGrid>

      <hr className="mt-4 mb-6" />

      <div className="mt-3">
        <H2>Page Views Chart</H2>
        <div className="mt-1">
          {isMounted ? (
            <BrushChart
              key={data.element?.id || data.website.id}
              data={data.periods.map((period) => [
                new Date(period.value).getTime(),
                period.count,
              ])}
            />
          ) : (
            <div className="flex flex-col items-center">
              <Loading />
            </div>
          )}
        </div>
      </div>

      <hr className="mt-4 mb-6" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4">
        <div>
          <H2>Dates</H2>
          <div className="mt-1">
            {isMounted ? (
              <BarChart
                key={data.element?.id || data.website.id}
                data={data.periods
                  .filter((period) => period.count)
                  .sort((a, b) => b.count - a.count)
                  .map((period) => period.count)}
                categories={data.periods
                  .filter((period) => period.count)
                  .sort((a, b) => b.count - a.count)
                  .map((period) =>
                    new Date(
                      new Date(period.value).setHours(0, 0, 0, 0)
                    ).toLocaleDateString(undefined, {
                      year: "2-digit",
                      month: "short",
                      day: "numeric",
                    })
                  )}
                elements={data.periods.map((period) => ({
                  id: period.id,
                }))}
              />
            ) : (
              <div className="flex flex-col items-center">
                <Loading />
              </div>
            )}
          </div>
        </div>
        <div>
          <H2>Pages</H2>
          <div className="mt-1 cursor-pointer">
            {isMounted ? (
              <BarChart
                key={data.element?.id || data.website.id}
                data={data.paths
                  .sort((a, b) => b.count - a.count)
                  .map((path) => path.count)}
                categories={data.paths
                  .sort((a, b) => b.count - a.count)
                  .map((path) => String(path.value))}
                elements={data.paths.map((path) => ({
                  id: path.id,
                }))}
                onClick={(id) =>
                  navigate(
                    `/app/dashboard/${data.website.id}?el=path&elId=${id}`
                  )
                }
              />
            ) : (
              <div className="flex flex-col items-center">
                <Loading />
              </div>
            )}
          </div>
        </div>
        <div>
          <H2>Browsers</H2>
          <div className="mt-1 cursor-pointer">
            {isMounted ? (
              <BarChart
                key={data.element?.id || data.website.id}
                data={data.browsers
                  .sort((a, b) => b.count - a.count)
                  .map((browser) => browser.count)}
                categories={data.browsers
                  .sort((a, b) => b.count - a.count)
                  .map((browser) => String(browser.value))}
                elements={data.browsers.map((browser) => ({
                  id: browser.id,
                }))}
                onClick={(id) =>
                  navigate(
                    `/app/dashboard/${data.website.id}?el=browser&elId=${id}`
                  )
                }
              />
            ) : (
              <div className="flex flex-col items-center">
                <Loading />
              </div>
            )}
          </div>
        </div>
        <div>
          <H2>Platforms</H2>
          <div className="mt-1 cursor-pointer">
            {isMounted ? (
              <BarChart
                key={data.element?.id || data.website.id}
                data={data.platforms
                  .sort((a, b) => b.count - a.count)
                  .map((platform) => platform.count)}
                categories={data.platforms
                  .sort((a, b) => b.count - a.count)
                  .map((platform) => String(platform.value))}
                elements={data.platforms.map((platform) => ({
                  id: platform.id,
                }))}
                onClick={(id) =>
                  navigate(
                    `/app/dashboard/${data.website.id}?el=platform&elId=${id}`
                  )
                }
              />
            ) : (
              <div className="flex flex-col items-center">
                <Loading />
              </div>
            )}
          </div>
        </div>
        <div>
          <H2>Referrers</H2>
          {data.referrers.length ? (
            <div className="mt-1 cursor-pointer">
              {isMounted ? (
                <BarChart
                  key={data.element?.id || data.website.id}
                  data={data.referrers
                    .sort((a, b) => b.count - a.count)
                    .map((referrer) => referrer.count)}
                  categories={data.referrers
                    .sort((a, b) => b.count - a.count)
                    .map((referrer) => String(referrer.value))}
                  elements={data.referrers.map((referrer) => ({
                    id: referrer.id,
                  }))}
                  onClick={(id) =>
                    navigate(
                      `/app/dashboard/${data.website.id}?el=referrer&elId=${id}`
                    )
                  }
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Loading />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-1">
              <p>No data.</p>
            </div>
          )}
        </div>
      </div>
    </>
  ) : (
    <div className="mx-auto flex max-w-xl flex-col items-center">
      <img
        className="h-60"
        src={illustration}
        alt="Woman looking at an empty canvas."
      />
      <p className="mt-3 text-center">
        No events registered yet for{" "}
        <Link
          className="font-bold"
          to={`/app/websites/details/${data.website.id}`}
        >
          {data.website.name}
        </Link>
        . Please make sure that you have properly set up the tracking script.
      </p>
      <p className="mt-3 w-full">
        <Button to={`/app/websites/details/${data.website.id}`} primary>
          See website details
        </Button>
      </p>
      <p className="mt-3 text-sm">
        <Link to="/docs">Need help?</Link>
      </p>
    </div>
  );
}
