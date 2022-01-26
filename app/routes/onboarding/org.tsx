import type { ActionFunction, LoaderFunction } from "remix";
import { Form, json, redirect, useActionData } from "remix";

import { Role, User } from "@prisma/client";
import { db } from "~/utils/db.server";
import {
  getUser,
  requireCurrentUser,
  requireUserId,
  setCurrentOrg,
} from "~/utils/session.server";

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
  const user = await requireCurrentUser(request);

  const form = await request.formData();
  const action = form.get("button-action");

  if (action === "skip") {
    try {
      const org = await db.org.create({
        data: { name: `${user.firstName}'s org`, createdById: user.id },
      });
      await db.userOrg.create({
        data: {
          userId: user.id,
          orgId: org.id,
          role: Role.OWNER,
          createdById: user.id,
        },
      });
    } catch {
      throw new Response("Something went wrong trying to onboard user.", {
        status: 500,
      });
    }

    return redirect("/onboarding/plan");
  }

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
    const org = await db.org.create({ data: { name, createdById: user.id } });
    await db.userOrg.create({
      data: {
        userId: user.id,
        orgId: org.id,
        role: Role.OWNER,
        createdById: user.id,
      },
    });

    return setCurrentOrg(org, "/onboarding/plan");
  } catch {
    throw new Response("Something went wrong trying to onboard user.", {
      status: 500,
    });
  }
};

export default function OnboardingOrgCreationRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <>
      <p>Thanks for creating an account!</p>

      <p>Create an organisation</p>
      <Form
        method="post"
        aria-describedby={
          actionData?.formError ? "form-error-message" : undefined
        }
      >
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
        <button type="submit" name="button-action" value="skip">
          Skip
        </button>
        <button type="submit" name="button-action" value="create">
          Create
        </button>
      </Form>
    </>
  );
}
