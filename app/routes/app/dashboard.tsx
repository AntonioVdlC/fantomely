import { Event, Website } from "@prisma/client";
import { LoaderFunction, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  website: Website;
  events: Event[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const websiteId = new URL(request.url).searchParams.get("w");

  if (!websiteId) {
    return redirect("/app/home");
  }

  const website = await db.website.findUnique({ where: { id: websiteId } });
  console.log(website);
  const events = await db.event.findMany({ where: { websiteId } });

  return { website, events };
};

export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <p>Dashboard</p>

      {data.website.url}

      <p>Events:</p>
      <ul>
        {data.events.map((event) => (
          <li key={event.id}>
            {event.id} | {event.path} | {event.type}
          </li>
        ))}
      </ul>
    </>
  );
}
