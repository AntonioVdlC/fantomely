import { Plan } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { requireCurrentUser } from "~/utils/session.server";

import H2 from "~/components/SectionHeader";
import LayoutGrid from "~/components/LayoutGrid";
import { db } from "~/utils/db.server";
import Button from "~/components/Button";

type LoaderData = {
  plan: Plan;
  current: {
    users: number;
    websites: number;
    events: number;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  // TODO: fetch this info from the database when not in beta
  const plan = {
    id: "000",
    name: "Private Beta",
    stripePriceId: "$some_price_id_private_beta",
    priceValueInUSD: 0,
    includeEventsMax: 10_000,
    includeUsersMax: 1,
    includeWebsitesMax: 3,
    includeCustomEvents: false,
  };

  const currentUsers = await db.userOrg.count({
    where: { orgId: user.currentOrg.id, user: { isActive: true } },
  });
  const currentWebsites = await db.website.count({
    where: { orgId: user.currentOrg.id, isActive: true },
  });

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const currentEvents = await db.event.findMany({
    where: { website: { orgId: user.currentOrg.id }, period: { year, month } },
  });

  return {
    plan,
    current: {
      users: currentUsers,
      websites: currentWebsites,
      events: currentEvents.reduce((sum, event) => (sum += event.count), 0),
    },
  };
};

export default function PlanRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <LayoutGrid>
        <div>
          <H2>Current Plan</H2>
          <p>{data.plan.name}</p>
        </div>
        <div>
          <H2>Price</H2>
          <p>
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "USD",
            }).format(data.plan.priceValueInUSD / 100)}{" "}
            per month
          </p>
        </div>
      </LayoutGrid>

      <hr className="my-4" />

      <LayoutGrid>
        <div>
          <H2>Current Users</H2>
          <p>{data.current.users}</p>
        </div>
        <div>
          <H2>Max Users</H2>
          <p>{data.plan.includeUsersMax}</p>
        </div>
      </LayoutGrid>

      <hr className="my-4" />

      <LayoutGrid>
        <div>
          <H2>Current Websites</H2>
          <p>{data.current.websites}</p>
        </div>
        <div>
          <H2>Max Websites</H2>
          <p>{data.plan.includeWebsitesMax}</p>
        </div>
      </LayoutGrid>

      <hr className="my-4" />

      <LayoutGrid>
        <div>
          <H2>Current Events</H2>
          <p>{data.current.events}</p>
        </div>
        <div>
          <H2>Max Events</H2>
          <p>
            {new Intl.NumberFormat().format(data.plan.includeEventsMax)} per
            month
          </p>
        </div>
        <div>
          <H2>Includes Custom Events</H2>
          <p>{data.plan.includeCustomEvents ? "Yes" : "No"}</p>
        </div>
      </LayoutGrid>

      <div className="mb-12"></div>
      <div className="max-w-md mx-auto">
        <Button to="/pricing" secondary>
          Learn more about pricing
        </Button>
      </div>
    </>
  );
}
