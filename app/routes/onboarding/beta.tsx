import type { ActionFunction, LoaderFunction } from "remix";
import { Form, json, redirect, useActionData } from "remix";

import { Role, User } from "@prisma/client";
import { db } from "~/utils/db.server";
import {
  getUser,
  requireValidSession,
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

function validateFirstName(firstName: unknown) {
  if (typeof firstName !== "string" || firstName.length < 1) {
    return `First names must be at least 1 character long`;
  }
}

function validateLastName(lastName: unknown) {
  if (typeof lastName !== "string" || lastName.length < 1) {
    return `Last names must be at least 1 character long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    firstName: string | undefined;
    lastName: string | undefined;
  };
  fields?: {
    firstName: string;
    lastName: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const user = await requireValidSession(request);
  const form = await request.formData();

  const firstName = form.get("first-name");
  const lastName = form.get("last-name");
  if (typeof firstName !== "string" || typeof lastName !== "string") {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { firstName, lastName };
  const fieldErrors = {
    firstName: validateFirstName(firstName),
    lastName: validateLastName(lastName),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

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

    await db.user.update({
      data: { firstName, lastName, isInWaitlist: false, isOnboarded: true },
      where: { id: user.id },
    });

    return setCurrentOrg({ user, org }, "/app");
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
      <p>Welcome to the private beta of Fantomely!</p>

      <p></p>

      <Form
        method="post"
        aria-describedby={
          actionData?.formError ? "form-error-message" : undefined
        }
      >
        <div>
          <label htmlFor="first-name-input">First Name</label>
          <input
            id="first-name-input"
            name="first-name"
            defaultValue={actionData?.fields?.firstName}
            type="text"
            aria-invalid={
              Boolean(actionData?.fieldErrors?.firstName) || undefined
            }
            aria-describedby={
              actionData?.fieldErrors?.firstName
                ? "first-name-error"
                : undefined
            }
          />
          {actionData?.fieldErrors?.firstName ? (
            <p
              className="form-validation-error"
              role="alert"
              id="first-name-error"
            >
              {actionData?.fieldErrors.firstName}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="last-name-input">Last Name</label>
          <input
            id="last-name-input"
            name="last-name"
            defaultValue={actionData?.fields?.lastName}
            type="text"
            aria-invalid={
              Boolean(actionData?.fieldErrors?.lastName) || undefined
            }
            aria-describedby={
              actionData?.fieldErrors?.lastName ? "last-name-error" : undefined
            }
          />
          {actionData?.fieldErrors?.lastName ? (
            <p
              className="form-validation-error"
              role="alert"
              id="last-name-error"
            >
              {actionData?.fieldErrors.lastName}
            </p>
          ) : null}
        </div>
        {/* TODO: add terms? */}

        <div id="form-error-message">
          {actionData?.formError ? (
            <>
              <p className="form-validation-error" role="alert">
                {actionData?.formError}
              </p>
            </>
          ) : null}
        </div>
        <button type="submit" className="button">
          Create account
        </button>
      </Form>
    </>
  );
}
