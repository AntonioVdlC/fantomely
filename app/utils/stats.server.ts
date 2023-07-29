import { Website } from "@prisma/client";
import { db } from "./db.server";
import { getDateComponents } from "./date";

export async function getPageViewsLastHour({
  website,
  currentDate,
}: {
  website: Website;
  currentDate: Date;
}) {
  const { year, month, day, hour } = getDateComponents(currentDate);

  // Current
  const current =
    (await db.event.count({
      where: {
        websiteId: website.id,
        period: { year, month, day, hour },
      },
    })) || 0;

  // Previous
  const previousDate = new Date(currentDate.getTime() - 60 * 60 * 1000);
  const {
    year: previousYear,
    month: previousMonth,
    day: previousDay,
    hour: previousHour,
  } = getDateComponents(previousDate);

  const previous =
    (await db.event.count({
      where: {
        websiteId: website.id,
        period: {
          year: previousYear,
          month: previousMonth,
          day: previousDay,
          hour: previousHour,
        },
      },
    })) || 0;

  // Change
  const change = current - previous;

  return { value: { current, previous }, change };
}

export async function getPageViewsLastDay({
  website,
  currentDate,
}: {
  website: Website;
  currentDate: Date;
}) {
  const { year, month, day } = getDateComponents(currentDate);

  // Current
  const current =
    (await db.event.count({
      where: {
        websiteId: website.id,
        period: { year, month, day },
      },
    })) || 0;

  // Previous
  const previousDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
  const {
    year: previousYear,
    month: previousMonth,
    day: previousDay,
  } = getDateComponents(previousDate);

  const previous =
    (await db.event.count({
      where: {
        websiteId: website.id,
        period: {
          year: previousYear,
          month: previousMonth,
          day: previousDay,
        },
      },
    })) || 0;

  // Change
  const change = current - previous;

  return { value: { current, previous }, change };
}

export async function getPageViewsLastMonth({
  website,
  currentDate,
}: {
  website: Website;
  currentDate: Date;
}) {
  const { year, month } = getDateComponents(currentDate);

  // Current
  const current =
    (await db.event.count({
      where: {
        websiteId: website.id,
        period: { year, month },
      },
    })) || 0;

  // Previous
  const previousDate = new Date(
    currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
  );
  const { year: previousYear, month: previousMonth } =
    getDateComponents(previousDate);

  const previous =
    (await db.event.count({
      where: {
        websiteId: website.id,
        period: {
          year: previousYear,
          month: previousMonth,
        },
      },
    })) || 0;

  // Change
  const change = current - previous;

  return { value: { current, previous }, change };
}
