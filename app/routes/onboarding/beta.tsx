import type { ActionFunction, LoaderFunction } from "remix";
import { Form, json, redirect, useActionData } from "remix";

import { Role } from "@prisma/client";
import { db } from "~/utils/db.server";
import {
  getUser,
  requireValidSession,
  setCurrentOrg,
} from "~/utils/session.server";
import Button from "~/components/Button";
import Logo from "~/components/Logo";

import illustration from "~/assets/illustration_onboarding.svg";

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
      <div className="w-screen">
        <div className="pt-10 bg-slate-50 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
          <div className="mx-auto max-w-7xl px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="mx-auto max-w-sm px-4 sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                <div className="lg:py-24">
                  <div className="flex justify-center">
                    <Logo size="lg" withLink />
                  </div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Welcome to fantomely!
                  </h2>
                  <p className="mt-3  text-center  text-sm text-slate-900">
                    Please fill in the following form to create your account.
                  </p>
                  <div className="mt-10 sm:mt-12">
                    <Form
                      method="post"
                      className="space-y-6"
                      aria-describedby={
                        actionData?.formError ? "form-error-message" : undefined
                      }
                    >
                      <div>
                        <label
                          htmlFor="first-name-input"
                          className="block text-sm font-medium text-slate-700"
                        >
                          First Name
                        </label>
                        <input
                          id="first-name-input"
                          name="first-name"
                          defaultValue={actionData?.fields?.firstName}
                          type="text"
                          required
                          placeholder="Jane"
                          className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                          aria-invalid={
                            Boolean(actionData?.fieldErrors?.firstName) ||
                            undefined
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
                        <label
                          htmlFor="last-name-input"
                          className="block text-sm font-medium text-slate-700"
                        >
                          Last Name
                        </label>
                        <input
                          id="last-name-input"
                          name="last-name"
                          defaultValue={actionData?.fields?.lastName}
                          type="text"
                          required
                          placeholder="Doe"
                          className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                          aria-invalid={
                            Boolean(actionData?.fieldErrors?.lastName) ||
                            undefined
                          }
                          aria-describedby={
                            actionData?.fieldErrors?.lastName
                              ? "last-name-error"
                              : undefined
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

                      <div id="form-error-message">
                        {actionData?.formError ? (
                          <>
                            <p className="form-validation-error" role="alert">
                              {actionData?.formError}
                            </p>
                          </>
                        ) : null}
                      </div>
                      <Button type="submit" primary>
                        Create account
                      </Button>
                    </Form>

                    <div id="form-error-message">
                      {actionData?.formError ? (
                        <>
                          <p
                            className="mt-3 text-sm text-slate-900"
                            role="alert"
                          >
                            {actionData?.formError}
                          </p>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 hidden lg:block lg:m-0 lg:relative">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6  lg:px-0">
                  <img
                    className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full "
                    src={illustration}
                    alt="Woman holding a string attached to a page with profile information"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
