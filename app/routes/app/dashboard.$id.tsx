import {
  Browser,
  Event,
  Path,
  Period,
  Platform,
  Website,
} from "@prisma/client";
import { Link, LoaderFunction, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import {
  generateRandomString,
  requireCurrentUser,
} from "~/utils/session.server";

import BrushChart from "~/components/BrushChart.client";
import { useEffect, useState } from "react";

import illustration from "~/assets/illustration_dashboard_empty.svg";
import Button from "~/components/Button";
import H2 from "~/components/SectionHeader";
import classNames from "~/utils/class-names";
import { generateWebsiteColor, generateWebsiteInitials } from "~/utils/website";
import LayoutGrid from "~/components/LayoutGrid";

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
  element: Path | Browser | Platform | undefined;
  paths: DashboardElement[];
  periods: DashboardElement[];
  browsers: DashboardElement[];
  platforms: DashboardElement[];
};

type ElementKey = "path" | "browser" | "platform" | undefined;

export const loader: LoaderFunction = async ({ request, params }) => {
  const { searchParams } = new URL(request.url);
  const websiteId = params.id;
  const el: ElementKey =
    searchParams.get("el") &&
    ["path", "browser", "platform"].includes(
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
  if (el && ["path"].includes(el) && elId) {
    where = { ...where, [`${el}Id`]: elId };
  }

  const events = await db.event.findMany({
    where,
    include: { path: true, period: true, browser: true, platform: true },
    orderBy: { period: { createdAt: "asc" } },
  });

  let element;
  if (el && ["path", "browser", "platform"].includes(el) && elId) {
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
  events.forEach((event) => {
    const path = paths.find((path) => path.id === event.pathId);
    if (path) {
      path.count += event.count;
    } else {
      paths.push({
        id: event.pathId,
        value: event.path.value,
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
  });

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

  return {
    website,
    events,
    element,
    paths,
    periods: filledPeriods,
    platforms,
    browsers,
  };
};

export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>();

  const [isMounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return data.periods.length ? (
    <>
      <LayoutGrid>
        <div>
          <H2>Dashboard for {data.website.name}</H2>
          <div className="mt-1 flex">
            <div
              className={classNames(
                generateWebsiteColor(data.website.name),
                "flex-shrink-0 flex items-center justify-center w-16 text-white text-xl font-medium rounded-l-md shadow-sm"
              )}
            >
              {generateWebsiteInitials(data.website.name)}
            </div>
            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-slate-200 bg-white rounded-r-md truncate shadow-sm">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <Link
                  to={`/app/websites/details/${data.website.id}`}
                  className="block text-slate-900 font-medium hover:text-slate-600"
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
      </LayoutGrid>
      <div className="mt-3"></div>
      <LayoutGrid>
        <div>
          <H2>Total page views</H2>
          <p className="mt-1 text-3xl">
            {data.events.reduce((total, event) => (total += event.count), 0)}
          </p>
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

      {isMounted && data.periods.length ? (
        <div className="mt-3">
          <H2>Page Views Chart</H2>
          <div className="mt-1">
            <BrushChart
              key={data.element?.id || data.website.id}
              data={data.periods.map((period) => [
                new Date(period.value).getTime(),
                period.count,
              ])}
            />
          </div>
        </div>
      ) : null}

      <p>Periods:</p>
      <ul>
        {data.periods.map((period) => (
          <li key={period.id}>
            {new Date(period.value).toString()} | {period.count}
          </li>
        ))}
      </ul>

      <p>Paths:</p>
      <ul>
        {data.paths.map((path) => (
          <li key={path.id}>
            <Link
              to={`/app/dashboard/${data.website.id}?el=path&elId=${path.id}`}
            >
              {path.value} | {path.count}
            </Link>
          </li>
        ))}
      </ul>

      <p>Browsers:</p>
      <ul>
        {data.browsers.map((browser) => (
          <li key={browser.id}>
            {browser.value} | {browser.count}
          </li>
        ))}
      </ul>

      <p>Platforms:</p>
      <ul>
        {data.platforms.map((platform) => (
          <li key={platform.id}>
            {platform.value} | {platform.count}
          </li>
        ))}
      </ul>
    </>
  ) : (
    <div className="flex flex-col items-center max-w-xl mx-auto">
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
