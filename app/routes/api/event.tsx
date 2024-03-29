import type { ActionFunction } from "@remix-run/node";

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

  const useragent = parseClientHints(request);

  // Website
  const publicKey = payload[KEYS.PUBLIC_KEY];

  const website = await db.website.findFirst({
    where: { publicKey },
  });

  if (!website || website.url !== origin) {
    throw new Response("Error while ingesting event. Website not found.", {
      status: 404,
    });
  }

  // Path
  const formattedPath = website.ignoreQueryString
    ? payload[KEYS.PATH].split("?")[0]
    : payload[KEYS.PATH];

  let path = await db.path.findUnique({
    where: { path: { value: formattedPath, websiteId: website.id } },
  });
  if (!path) {
    path = await db.path.create({
      data: {
        value: formattedPath,
        websiteId: website.id,
      },
    });
  }

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

  // Referrer
  const formattedReferrer = payload[KEYS.REFERRER] || "Direct";
  let referrer = await db.referrer.findUnique({
    where: { referrer: { value: formattedReferrer, websiteId: website.id } },
  });
  if (!referrer) {
    referrer = await db.referrer.create({
      data: {
        value: formattedReferrer,
        websiteId: website.id,
      },
    });
  }

  // Upsert event
  await db.event.upsert({
    where: {
      website_period_path: {
        websiteId: website.id,
        periodId: period.id,
        pathId: path.id,
        browserId: browser.id || "",
        platformId: platform.id || "",
        referrerId: referrer.id,
      },
    },
    create: {
      websiteId: website.id,
      periodId: period.id,
      pathId: path.id,
      browserId: browser.id || "",
      platformId: platform.id || "",
      referrerId: referrer.id,
      count: 1,
    },
    update: {
      count: { increment: 1 },
    },
  });

  return new Response("ok", {
    headers: {
      "Access-Control-Allow-Origin": website.url,
    },
  });
};
