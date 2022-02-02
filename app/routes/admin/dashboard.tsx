import { User } from "@prisma/client";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
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
      console.log(email);
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
      // TODO
      console.log(
        `emailto: ${user.email}`,
        `/auth/waitlist/callback?email=${user.email}&token=${waitlistToken}`
      );

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
