import type { ActionFunction, LoaderFunction } from "remix";
import { Form, json, redirect, useActionData } from "remix";

import { Role, User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getUser, requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  if (user.isOnboarded) {
    return redirect("/app");
  }

  return {};
};

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
  const userId = await requireUserId(request);

  const form = await request.formData();
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

  try {
    const org = await db.org.create({ data: { name } });
    await db.userOrg.create({
      data: { userId, orgId: org.id, role: Role.OWNER },
    });

    await db.user.update({
      data: { isOnboarded: true },
      where: { id: userId },
    });
  } catch {
    throw new Response("Something went wrong trying to onboard user.", {
      status: 500,
    });
  }

  return redirect("/app");
};

export default function RegisterSentRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <>
      <p>Thanks for creating an account!</p>

      <p>Create an organisation</p>
      <Form method="post">
        <div>
          <label htmlFor="name-input">Name</label>
          <input
            id="name-input"
            name="name"
            defaultValue={actionData?.fields?.name}
            type="text"
            aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
            aria-describedby={
              actionData?.fieldErrors?.name ? "name-error" : undefined
            }
          />
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData?.fieldErrors.name}
            </p>
          ) : null}
        </div>
        {/* TODO: add language? */}
        {/* TODO: add terms? */}
        <button type="submit">Continue</button>
      </Form>
    </>
  );
}
