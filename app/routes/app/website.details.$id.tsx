import { Org, User, UserOrg, Website } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";

type LoaderData = {
  user: User & {
    orgs: (UserOrg & {
        org: Org;
    })[]
  };
  website: Website;
  origin: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await requireCurrentUser(request);
  const website = await db.website.findUnique({ where: { id: params.id } });

  return { website, user, origin: new URL(request.url).origin };
};

export default function WebsiteDetailsRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <p>Website Edit</p>
      <p>URL: {data.website.url}</p>
      <p>Public Key: {data.website.publicKey}</p>

      <p>To start tracking, please add the following line to your website:</p>

      <code>
        {`<script defer src="${data.origin}/sdk.js?publicKey=${data.website.publicKey}"></script>`}
      </code>
    </>
  );
}
