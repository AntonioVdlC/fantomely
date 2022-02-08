import { Website } from "@prisma/client";
import { db } from "./db.server";

export async function getPageViewsLastHour({
  website,
  currentDate,
}: {
  website: Website;
  currentDate: Date;
}) {
  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth() + 1;
  const day = currentDate.getUTCDate();
  const hour = currentDate.getUTCHours();

  const value = { current: 0, previous: 0 };

  // Current
  const eventsCurrent = await db.event.findMany({
    where: {
      websiteId: website.id,
      period: { year, month, day, hour },
    },
  });

  value.current = eventsCurrent.reduce((sum, event) => (sum += event.count), 0);

  // Previous
  const previousDate = new Date(currentDate.getTime() - 60 * 60 * 1000);
  const previousYear = previousDate.getUTCFullYear();
  const previousMonth = previousDate.getUTCMonth() + 1;
  const previousDay = previousDate.getUTCDate();
  const previousHour = previousDate.getUTCHours();

  const events = await db.event.findMany({
    where: {
      websiteId: website.id,
      period: {
        year: previousYear,
        month: previousMonth,
        day: previousDay,
        hour: previousHour,
      },
    },
  });

  value.previous = events.reduce((sum, event) => (sum += event.count), 0);

  // Change
  const change = value.current - value.previous;

  return { value, change };
}

export async function getPageViewsLastDay({
  website,
  currentDate,
}: {
  website: Website;
  currentDate: Date;
}) {
  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth() + 1;
  const day = currentDate.getUTCDate();

  const value = { current: 0, previous: 0 };

  // Current
  const eventsCurrent = await db.event.findMany({
    where: {
      websiteId: website.id,
      period: { year, month, day },
    },
  });

  value.current = eventsCurrent.reduce((sum, event) => (sum += event.count), 0);

  // Previous
  const previousDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
  const previousYear = previousDate.getUTCFullYear();
  const previousMonth = previousDate.getUTCMonth() + 1;
  const previousDay = previousDate.getUTCDate();

  const events = await db.event.findMany({
    where: {
      websiteId: website.id,
      period: {
        year: previousYear,
        month: previousMonth,
        day: previousDay,
      },
    },
  });

  value.previous = events.reduce((sum, event) => (sum += event.count), 0);

  // Change
  const change = value.current - value.previous;

  return {
    value,
    change,
  };
}

export async function getPageViewsLastMonth({
  website,
  currentDate,
}: {
  website: Website;
  currentDate: Date;
}) {
  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth() + 1;

  const value = { current: 0, previous: 0 };

  // Current
  const eventsCurrent = await db.event.findMany({
    where: {
      websiteId: website.id,
      period: { year, month },
    },
  });

  value.current = eventsCurrent.reduce((sum, event) => (sum += event.count), 0);

  // Previous
  const previousDate = new Date(
    currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
  );
  const previousYear = previousDate.getUTCFullYear();
  const previousMonth = previousDate.getUTCMonth() + 1;

  const events = await db.event.findMany({
    where: {
      websiteId: website.id,
      period: {
        year: previousYear,
        month: previousMonth,
      },
    },
  });

  value.previous = events.reduce((sum, event) => (sum += event.count), 0);

  // Change
  const change = value.current - value.previous;

  return {
    value,
    change,
  };
}
