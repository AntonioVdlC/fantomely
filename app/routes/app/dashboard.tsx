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

type LoaderData = {
  website: Website;
  events: (Event & {
    path: Path;
    period: Period;
    browser?: Browser;
    platform?: Platform;
  })[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const websiteId = searchParams.get("w");
  const el = searchParams.get("el");
  const elId = searchParams.get("elId");

  if (!websiteId) {
    return redirect("/app/home");
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
  });

  let element;
  if (el && ["path"].includes(el) && elId) {
    const event = events.find((event) => Boolean(event[el]));
    if (event) {
      element = event[el];
    }
  }

  return { website, events, element };
};

type DashboardElement = {
  id: string;
  value: string;
  count: number;
};

export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>();

  const paths: DashboardElement[] = [];
  const periods: DashboardElement[] = [];
  const browsers: DashboardElement[] = [];
  const platforms: DashboardElement[] = [];
  data.events.forEach((event) => {
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

    const period = periods.find((period) => period.id === event.periodId);
    if (period) {
      period.count += event.count;
    } else {
      periods.push({
        id: event.periodId,
        value: new Date(
          event.period.year,
          event.period.month - 1,
          event.period.day,
          event.period.hour
        ).toString(),
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

  return (
    <>
      <p>Dashboard</p>

      {data.website.url}

      <p>
        Total page views for {data.element?.value}:{" "}
        {data.events.reduce((total, event) => (total += event.count), 0)}
      </p>

      <p>Periods:</p>
      <ul>
        {periods.map((period) => (
          <li key={period.id}>
            {period.value} | {period.count}
          </li>
        ))}
      </ul>

      <p>Paths:</p>
      <ul>
        {paths.map((path) => (
          <li key={path.id}>
            <Link to={`/app/dashboard/w/${data.website.id}/path/${path.id}`}>
              {path.value} | {path.count}
            </Link>
          </li>
        ))}
      </ul>

      <p>Browsers:</p>
      <ul>
        {browsers.map((browser) => (
          <li key={browser.id}>
            {browser.value} | {browser.count}
          </li>
        ))}
      </ul>

      <p>Platforms:</p>
      <ul>
        {platforms.map((platform) => (
          <li key={platform.id}>
            {platform.value} | {platform.count}
          </li>
        ))}
      </ul>
    </>
  );
}
