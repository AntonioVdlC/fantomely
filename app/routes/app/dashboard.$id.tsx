import { useEffect, useState } from "react";

import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import type {
  Browser,
  Path,
  Platform,
  Referrer,
  Website,
} from "@prisma/client";

import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";
import classNames from "~/utils/class-names";
import { generateWebsiteColor, generateWebsiteInitials } from "~/utils/website";

import BarChart from "~/components/BarChart.client";
// import BrushChart from "~/components/BrushChart.client";
import Button from "~/components/Button";
import H2 from "~/components/SectionHeader";
import LayoutGrid from "~/components/LayoutGrid";
import Loading from "~/components/Loading";

import illustration from "~/assets/illustration_dashboard_empty.svg";
import { useLoaderData, Link } from "@remix-run/react";
import type { DashboardElement } from "~/types/dashboard";

type LoaderData = {
  website: Website;
  element: Path | Browser | Platform | Referrer | undefined;
  paths: DashboardElement[];
  periods: DashboardElement[];
  browsers: DashboardElement[];
  platforms: DashboardElement[];
  referrers: DashboardElement[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const websiteId = params.id;
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

  const [periods, browsers, paths, platforms, referrers] = await Promise.all([
    db.$queryRaw<DashboardElement[]>`
      SELECT
        "Period"."id",
        MAKE_DATE("Period"."year", "Period"."month", "Period"."day") as "label",
        COUNT(*) as "count"
      FROM "Event" INNER JOIN "Period" ON "Event"."periodId" = "Period"."id"
      WHERE "Event"."websiteId" = ${website.id}
      GROUP BY 1, 2
      ORDER BY 2 ASC`,
    db.$queryRaw<DashboardElement[]>`
      SELECT
        "Browser"."id",
        "Browser"."value" as "label",
        COUNT(*) as "count"
      FROM "Event" INNER JOIN "Browser" ON "Event"."browserId" = "Browser"."id"
      WHERE "Event"."websiteId" = ${website.id}
      GROUP BY 1, 2
      ORDER BY 3 DESC`,
    db.$queryRaw<DashboardElement[]>`
      SELECT
        "Path"."id",
        "Path"."value" as "label",
        COUNT(*) as "count"
      FROM "Event" INNER JOIN "Path" ON "Event"."pathId" = "Path"."id"
      WHERE "Event"."websiteId" = ${website.id}
      GROUP BY 1, 2
      ORDER BY 3 DESC`,
    db.$queryRaw<DashboardElement[]>`
      SELECT
        "Platform"."id",
        "Platform"."value" as "label",
        COUNT(*) as "count"
      FROM "Event" INNER JOIN "Platform" ON "Event"."platformId" = "Platform"."id"
      WHERE "Event"."websiteId" = ${website.id}
      GROUP BY 1, 2
      ORDER BY 3 DESC`,
    db.$queryRaw<DashboardElement[]>`
      SELECT
        "Referrer"."id",
        "Referrer"."value" as "label",
        COUNT(*) as "count"
      FROM "Event" INNER JOIN "Referrer" ON "Event"."referrerId" = "Referrer"."id"
      WHERE "Event"."websiteId" = ${website.id}
      GROUP BY 1, 2
      ORDER BY 3 DESC`,
  ]);

  return {
    website,
    paths,
    periods,
    platforms,
    browsers,
    referrers,
  };
};

export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>();

  const [isMounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-slate-200 bg-white shadow-sm">
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
      </LayoutGrid>

      <hr className="mb-6 mt-4" />

      <div className="mt-3">
        <H2>Page Views Chart</H2>
        <div className="mt-1">
          {isMounted ? (
            // <BrushChart
            //   key={data.element?.id || data.website.id}
            //   data={data.periods.map((period) => [
            //     new Date(period.value).getTime(),
            //     period.count,
            //   ])}
            // />
            <div></div>
          ) : (
            <div className="flex flex-col items-center">
              <Loading />
            </div>
          )}
        </div>
      </div>

      <hr className="mb-6 mt-4" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4">
        <div>
          <H2>Pages</H2>
          <div className="mt-1 cursor-pointer">
            {isMounted ? (
              <BarChart
                key={`bar-pages-${data.website.id}`}
                data={data.paths}
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
          <div className="mt-1 cursor-pointer">
            {isMounted ? (
              <BarChart
                key={`bar-referrers-${data.website.id}`}
                data={data.referrers}
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
                key={`bar-browsers-${data.website.id}`}
                data={data.browsers}
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
                key={`bar-platforms-${data.website.id}`}
                data={data.platforms}
              />
            ) : (
              <div className="flex flex-col items-center">
                <Loading />
              </div>
            )}
          </div>
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
