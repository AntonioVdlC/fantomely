import { Website } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";

type LoaderData = {
  websites: Website[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  const websites = await db.website.findMany({
    where: { orgId: user.currentOrg.id },
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
