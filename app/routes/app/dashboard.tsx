import { Website } from "@prisma/client";
import { LoaderFunction, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";

import DashboardSection from "~/components/DashboardSection";
import {
  getPageViewsLastDay,
  getPageViewsLastHour,
  getPageViewsLastMonth,
} from "~/utils/stats.server";

type PageViewsItem = {
  value: {
    current: number;
    previous: number;
  };
  change: number;
};

type PageViews = {
  hour: PageViewsItem;
  day: PageViewsItem;
  month: PageViewsItem;
};

type LoaderData = {
  websites: (Website & {
    pageViews: PageViews;
  })[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);
  const websites = await db.website.findMany({
    where: { orgId: user.currentOrg.id, isActive: true },
  });

  if (!websites.length) {
    return redirect("/app/websites");
  }

  const currentDate = new Date();

  return {
    websites: await Promise.all(
      websites.map(async (website) => {
        const pageViews = {
          hour: await getPageViewsLastHour({ website, currentDate }),
          day: await getPageViewsLastDay({ website, currentDate }),
          month: await getPageViewsLastMonth({ website, currentDate }),
        };

        return { ...website, pageViews };
      })
    ),
  };
};

export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <div className="divide-y divide-slate-200">
        <div className="pb-6">
          <DashboardSection
            title="Page Views (last hour)"
            items={data.websites.map((website) => ({
              id: website.id,
              name: website.name,
              stats: { ...website.pageViews.hour },
            }))}
          />
        </div>

        <div className="py-6">
          <DashboardSection
            title="Page Views (last day)"
            items={data.websites.map((website) => ({
              id: website.id,
              name: website.name,
              stats: { ...website.pageViews.day },
            }))}
          />
        </div>

        <div className="pt-6">
          <DashboardSection
            title="Page Views (last 30 days)"
            items={data.websites.map((website) => ({
              id: website.id,
              name: website.name,
              stats: { ...website.pageViews.month },
            }))}
          />
        </div>
      </div>
    </>
  );
}
