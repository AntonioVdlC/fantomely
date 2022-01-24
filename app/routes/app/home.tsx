import { Website } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

type LoaderData = {
  websites: Website[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const websites = await db.website.findMany({
    where: { createdById: userId },
  });

  return {
    websites,
  };
};

export default function HomeRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <p>Home</p>
      <Link to="/app/website/create">Create Website Tracking</Link>
      <p>Websites:</p>
      <ul>
        {data.websites.map((website) => (
          <li key={website.id}>
            <Link to={`/app/dashboard?w=${website.id}`}>{website.url}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
