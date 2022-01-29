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
  const day = now.getUTCDay();
  const hour = now.getUTCHours();

  const origin = request.headers.get("Origin");
  const payload = await request.json();

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

  console.dir(website)

  // Path
  let path = await db.path.findFirst({
    where: { value: payload[KEYS.PATH], websiteId: website.id },
  });
  if (!path) {
    path = await db.path.create({
      data: {
        value: payload[KEYS.PATH],
        websiteId: website.id,
      },
    });
  }

  console.dir(path)
  // Browser
  let browser = await db.browser.findFirst({
    where: { value: useragent.browser, websiteId: website.id },
  });
  if (!browser) {
    browser = await db.browser.create({
      data: {
        value: useragent.browser,
        websiteId: website.id,
      },
    });
  }

  console.dir(browser)
  // Platform
  let platform = await db.platform.findFirst({
    where: { value: useragent.platform, websiteId: website.id },
  });
  if (!platform) {
    platform = await db.platform.create({
      data: {
        value: useragent.platform,
        websiteId: website.id,
      },
    });
  }

  console.dir(platform)
  // Find period
  let period = await db.period.findFirst({
    where: {
      websiteId: website.id,
      year,
      month,
      day,
      hour,
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

  console.dir(period)
  // Find event
  let event = await db.event.findFirst({
    where: {
      websiteId: website.id,
      periodId: period.id,
      pathId: path.id,
      browserId: browser.id || null,
      platformId: platform.id || null,
    },
  });
  if (!event) {
    event = await db.event.create({
      data: {
        websiteId: website.id,
        periodId: period.id,
        pathId: path.id,
        browserId: browser.id || null,
        platformId: platform.id || null,
        count: 0,
      },
    });
  }
  console.dir(event)

  // Save event in database
  await db.event.update({
    data: { count: event.count + 1 },
    where: { id: event.id },
  });

  return new Response("ok", {
    headers: {
      "Access-Control-Allow-Origin": website.url,
    },
  });
};
