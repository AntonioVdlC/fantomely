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
import { requireCurrentUser } from "~/utils/session.server";

import BrushChart from "~/components/BrushChart.client";
import { useEffect, useState } from "react";

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

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const websiteId = searchParams.get("w");
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

  return {
    website,
    events,
    element,
    paths,
    periods: periods.map((period) => ({
      id: period.id,
      value: period.value,
      count: period.count,
    })),
    platforms,
    browsers,
  };
};

export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>();

  const [isMounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <p>Dashboard</p>

      {data.website.url}

      <p>
        Total page views for {data.element?.value}:{" "}
        {data.events.reduce((total, event) => (total += event.count), 0)}
      </p>

      {isMounted && data.periods.length ? (
        <BrushChart
          data={data.periods.map((period) => [
            new Date(period.value).getTime(),
            period.count,
          ])}
        />
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
              to={`/app/dashboard?w=${data.website.id}&el=path&elId=${path.id}`}
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
  );
}
