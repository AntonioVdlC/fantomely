import {
  Browser,
  Event,
  Path,
  Period,
  Platform,
  Website,
} from "@prisma/client";
import { LoaderFunction, redirect, useLoaderData } from "remix";
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
  const websiteId = new URL(request.url).searchParams.get("w");

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

  const events = await db.event.findMany({
    where: { websiteId: website.id },
    include: { path: true, period: true, browser: true, platform: true },
  });

  return { website, events };
};

type DashboardElement = {
  id: string;
  value: string;
  count: number;
};

export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>();

  const paths: DashboardElement[] = [];
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
        Total page views:{" "}
        {data.events.reduce((total, event) => (total += event.count), 0)}
      </p>

      <p>Paths:</p>
      <ul>
        {paths.map((path) => (
          <li key={path.id}>
            {path.value} | {path.count}
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
