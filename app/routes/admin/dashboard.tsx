import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";

import type { User } from "@prisma/client";

import { db } from "~/utils/db.server";
import { send, templates } from "~/utils/email.server";
import {
  generateRandomString,
  requireAdminSession,
} from "~/utils/session.server";

type LoaderData = {
  usersInWaitlist: User[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const adminSession = await requireAdminSession(request);

  if (!adminSession?.token) {
    return redirect("/admin/login");
  }

  // List of users in waitlist
  const usersInWaitlist = await db.user.findMany({
    where: {
      isInWaitlist: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return { usersInWaitlist };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const action = form.get("_action");

  switch (action) {
    case "waitlist_invite": {
      const email = form.get("email");
      if (!email || typeof email !== "string") {
        throw new Error("No email.");
      }

      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("No user.");
      }

      if (!user.isInWaitlist) {
        throw new Error("User not in waitlist.");
      }

      // Generate token
      const waitlistToken = generateRandomString(32);

      await db.user.update({ data: { waitlistToken }, where: { id: user.id } });

      // Send invite link
      try {
        await send({
          from: "fantomely <hi@fantomely.com>",
          to: user.email,
          subject: "Welcome to Fantomely",
          html: templates.welcomeBeta({
            firstName: user.firstName || "",
            link: `${
              process.env.BASE_URL
            }/auth/waitlist/callback?email=${encodeURIComponent(
              user.email
            )}&token=${waitlistToken}`,
          }),
          text: `Welcome to Fantomely!
          You can now finish your registration using the following link: ${
            process.env.BASE_URL
          }/auth/waitlist/callback?email=${encodeURIComponent(
            user.email
          )}&token=${waitlistToken}`,
        });
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error);
        throw new Error(error);
      }

      // Update user
      await db.user.update({
        data: {
          waitlistInviteSent: true,
          waitlistInviteSentAt: new Date(Date.now()),
        },
        where: { id: user.id },
      });

      break;
    }
  }

  return null;
};

export default function AdminDashboardRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <p>Dashboard</p>
      <form method="post" action="/admin/logout">
        <button type="submit">Logout</button>
      </form>

      <p>Users in waitlist</p>
      <ul>
        {data.usersInWaitlist?.map((user) => (
          <li key={user.id}>
            <Form method="post">
              <input type="email" name="email" readOnly value={user.email} />
              <button type="submit" name="_action" value="waitlist_invite">
                Send Invite
              </button>
              {user.waitlistInviteSent && user.waitlistInviteSentAt ? (
                <p>
                  Invite sent at{" "}
                  {new Date(user.waitlistInviteSentAt).toISOString()}
                </p>
              ) : null}
            </Form>
          </li>
        ))}
      </ul>
    </>
  );
}
