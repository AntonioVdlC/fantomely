import { EventType, Prisma } from "@prisma/client";
import { json, ActionFunction } from "remix";
import { db } from "~/utils/db.server";
import { parseClientHints } from "~/utils/useragent.server";

const KEYS = {
  PATH: "p",
  PUBLIC_KEY: "k",
  REFERRER: "r",
};

export const action: ActionFunction = async ({ request }) => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const hour = now.getUTCHours();

  const origin = request.headers.get("Origin");
  const payload = await request.json();

  console.log("==== event", payload)

  const useragent = parseClientHints(request);

  // Website
  const website = await db.website.findFirst({
    where: { publicKey: payload[KEYS.PUBLIC_KEY] },
  });

  if (!website || website.url !== origin) {
    throw new Response("Error while ingesting event. Website not found.", {
      status: 404,
    });
  }

  console.dir(website);

  // Path
  let path = await db.path.findUnique({
    where: { path: { value: payload[KEYS.PATH], websiteId: website.id } },
  });
  if (!path) {
    path = await db.path.create({
      data: {
        value: payload[KEYS.PATH],
        websiteId: website.id,
      },
    });
  }

  console.dir(path);
  // Browser
  let browser = await db.browser.findUnique({
    where: { browser: { value: useragent.browser, websiteId: website.id } },
  });
  if (!browser) {
    browser = await db.browser.create({
      data: {
        value: useragent.browser,
        websiteId: website.id,
      },
    });
  }

  console.dir(browser);
  // Platform
  let platform = await db.platform.findUnique({
    where: { platform: { value: useragent.platform, websiteId: website.id } },
  });
  if (!platform) {
    platform = await db.platform.create({
      data: {
        value: useragent.platform,
        websiteId: website.id,
      },
    });
  }

  console.dir(platform);
  // Find period
  let period = await db.period.findUnique({
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
  if (!period) {
    period = await db.period.create({
      data: {
        websiteId: website.id,
        year,
        month,
        day,
        hour,
      },
    });
  }

  console.dir(period);
  // Find event
  const event = await db.event.upsert({
    where: {
      website_period_path: {
        websiteId: website.id,
        periodId: period.id,
        pathId: path.id,
        browserId: browser.id || "",
        platformId: platform.id || "",
      },
    },
    create: {
      websiteId: website.id,
      periodId: period.id,
      pathId: path.id,
      browserId: browser.id || "",
      platformId: platform.id || "",
      count: 1,
    },
    update: {
      count: { increment: 1 },
    },
  });
  console.dir(event);

  return new Response("ok", {
    headers: {
      "Access-Control-Allow-Origin": website.url,
    },
  });
};
