import { useLoaderData, Link } from "remix";

import type { LoaderFunction } from "remix";
import type { Website } from "@prisma/client";

import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";

import LayoutGrid from "~/components/LayoutGrid";
import WebsiteCreateForm from "~/components/WebsiteCreateForm";
import H2 from "~/components/SectionHeader";
import WebsiteListItem from "~/components/WebsiteListItem";

type LoaderData = {
  websites: Website[];
  isWebsiteCountBelowLimit: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  const websites = await db.website.findMany({
    where: { orgId: user.currentOrg.id, isActive: true },
  });

  return {
    websites,
    // TODO: check website limit according to current plan
    isWebsiteCountBelowLimit: websites.length < 3,
  };
};

export default function WebsitesRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <div className="divide-y divide-slate-200">
        <div className="pb-6">
          <H2>Existing Websites</H2>
          {data.websites.length ? (
            <ul role="list" className="mt-3">
              <LayoutGrid>
                {data.websites.map((website) => (
                  <li key={website.id} className="col-span-1">
                    <WebsiteListItem website={website} />
                  </li>
                ))}
              </LayoutGrid>
            </ul>
          ) : (
            <p className="mt-3 text-sm ">
              No websites tracked. Start by adding your first website!
            </p>
          )}
        </div>

        <div className="py-6">
          <H2>Add a new website</H2>

          {data.isWebsiteCountBelowLimit ? (
            <WebsiteCreateForm />
          ) : (
            <p className="mt-3 text-sm">
              You have reached the limit of websites you can add with your
              current <Link to="/app/plan">plan</Link>. Please delete another
              webiste or upgrade your plan to add more websites.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
