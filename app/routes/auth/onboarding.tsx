import { ActionFunction, Link, LoaderFunction } from "remix";
import { Form, useLoaderData, json, redirect, useActionData } from "remix";

import type { User, UserOrg, Org, Invite } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

function validateName(name: unknown) {
  if (typeof name !== "string" || name.length < 3) {
    return `Last names must be at least 3 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
  };
  fields?: {
    name: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    throw new Response("Error, no session found", { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { orgs: { include: { org: true } } },
  });

  if (!user) {
    throw new Response("Error, no user found", { status: 400 });
  }

  const invites = await db.invite.findMany({
    where: { email: user.email, isActive: true },
    include: { org: true },
  });

  const form = await request.formData();

  if (invites.length) {
    const invites = form.getAll("invites");
    if (invites.length) {
      // Accept checked invites
      // TODO
    }
  }

  if (!user.orgs.length) {
    const name = form.get("name");

    if (typeof name !== "string") {
      return badRequest({
        formError: `Form not submitted correctly.`,
      });
    }

    const fields = { name };
    const fieldErrors = {
      name: validateName(name),
    };
    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({ fieldErrors, fields });
    }

    const org = await db.org.create({ data: { name } });

    if (!org) {
      throw new Response(
        "Something went wrong trying to create a new organisation.",
        {
          status: 500,
        }
      );
    }
  }

  return redirect("/app");
};

type LoaderData = {
  user: User & {
    orgs: (UserOrg & { org: Org })[];
  };
  invites: (Invite & { org: Org })[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    throw new Response("Error, no session found", { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { orgs: { include: { org: true } } },
  });

  if (!user) {
    throw new Response("Error, no user found", { status: 400 });
  }

  const invites = await db.invite.findMany({
    where: { email: user.email, isActive: true },
    include: { org: true },
  });

  const data: LoaderData = {
    user,
    invites,
  };

  if (user.isOnboardingCompleted) {
    return redirect("/app");
  }

  return data;
};

export default function RegisterSentRoute() {
  const actionData = useActionData<ActionData>();
  const data = useLoaderData<LoaderData>();

  if (!data.user) {
    throw new Error("User not found");
  }

  return (
    <>
      <p>Thanks for creating an account!</p>(
      {!data.user.isEmailVerified ? (
        <p>
          You will receive a link at {data.user.email} to verify your email!
        </p>
      ) : null}
      <Form method="post">
        {data.invites.length ? (
          <>
            <p>You have other invites pending:</p>
            <ul>
              {data.invites.map((invite) => (
                <li>
                  <label>
                    <input
                      type="checkbox"
                      name="invite"
                      value={invite.org.id}
                    ></input>{" "}
                    {invite.org.name}
                  </label>
                </li>
              ))}
            </ul>
            <button type="submit">Submit</button>
          </>
        ) : null}
        {!data.user.orgs.length ? (
          <>
            <p>Create an organisation</p>

            <div>
              <label htmlFor="name-input">Name</label>
              <input
                id="name-input"
                name="name"
                defaultValue={actionData?.fields?.name}
                type="text"
                aria-invalid={
                  Boolean(actionData?.fieldErrors?.name) || undefined
                }
                aria-describedby={
                  actionData?.fieldErrors?.name ? "name-error" : undefined
                }
              />
              {actionData?.fieldErrors?.name ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="name-error"
                >
                  {actionData?.fieldErrors.name}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
        {/* TODO: add language? */}
        <label>
          <input type="checkbox" name="terms"></input> Accept{" "}
          <Link to="/terms" target="_blank">
            terms and conditions
          </Link>
          .
        </label>
      </Form>
    </>
  );
}
