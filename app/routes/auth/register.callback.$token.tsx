import { User, UserOrg, Org } from "@prisma/client";
import type { LoaderFunction } from "remix";
import { useLoaderData, redirect, Form } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = { user: User & { orgs: (UserOrg & { org: Org })[] } };

export const loader: LoaderFunction = async ({ params }) => {
  const token = params.token;
  if (!token) {
    throw new Response("Error, no token present", { status: 400 });
  }

  const session = await db.magicLink.findUnique({ where: { token } });
  if (!session) {
    throw new Response("Error, no session found", { status: 400 });
  }
  if (session.isUsed) {
    throw new Response("Error, session used", { status: 400 });
  }
  await db.magicLink.update({
    data: { isUsed: true },
    where: { id: session.id },
  });

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: { orgs: { include: { org: true } } },
  });
  if (!user) {
    throw new Response("Error, no user foung", { status: 400 });
  }

  const data: LoaderData = { user };
  return data;
};

export default function RegisterCallbackRoute() {
  const data = useLoaderData<LoaderData>();

  if (data.user.orgs.length) {
    return redirect("/app");
  }

  return (
    <div>
      <p>Welcome, start by creating a new organisation</p>
      <Form method="post">

      </Form>
    </div>
  )
}
