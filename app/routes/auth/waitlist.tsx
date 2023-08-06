import { redirect, json } from "@remix-run/node";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { db } from "~/utils/db.server";
import { isValidEmail } from "~/utils/is-valid";
import { getUserId, joinWaitlist } from "~/utils/session.server";

import Button from "~/components/Button";
import Logo from "~/components/Logo";

import illustration from "~/assets/illustration_waitlist.svg";
import { useActionData, Form, Link, useTransition } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    // Redirect to the home page if they are already signed in.
    return redirect("/app");
  }

  return null;
};

function validateEmail(email: unknown) {
  if (typeof email !== "string" || !isValidEmail(email)) {
    return `The email is invalid`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
  };
  fields?: {
    email: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  if (typeof email !== "string" || !email) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { email };
  const fieldErrors = {
    email: validateEmail(email),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const userExists = await db.user.findFirst({
    where: { email },
  });
  if (userExists) {
    return badRequest({
      fields,
      formError: `User already exists`,
    });
  }
  const user = await joinWaitlist({ email });
  if (!user) {
    return badRequest({
      fields,
      formError: `User already exists`,
    });
  }

  return redirect(`/auth/waitlist/sent?email=${encodeURIComponent(email)}`);
};

export default function RegisterRoute() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  return (
    <div className="w-screen">
      <div className="bg-slate-50 pt-10 sm:pt-16 lg:overflow-hidden lg:pb-14 lg:pt-8">
        <div className="mx-auto max-w-7xl px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="mx-auto max-w-sm px-4 sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
              <div className="lg:py-24">
                <div className="flex justify-center">
                  <Logo size="lg" withLink />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                  Sorry, we are currently in private beta!
                </h2>
                <p className="mt-3  text-center  text-sm text-slate-900">
                  You can join the wailist by providing your email below.
                </p>
                <div className="mt-10 sm:mt-12">
                  <Form
                    className="space-y-6"
                    method="post"
                    aria-describedby={
                      actionData?.formError ? "form-error-message" : undefined
                    }
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          defaultValue={actionData?.fields?.email || ""}
                          aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                          aria-describedby={
                            actionData?.fieldErrors?.email
                              ? "email-error"
                              : undefined
                          }
                          placeholder="jane.doe@email.com"
                          className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-slate-500 sm:text-sm"
                        />
                        {actionData?.fieldErrors?.email ? (
                          <p
                            className="form-validation-error"
                            role="alert"
                            id="email-error"
                          >
                            {actionData?.fieldErrors.email}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <Button
                      primary
                      type="submit"
                      loading={Boolean(transition.submission)}
                    >
                      {transition.submission
                        ? "Joining ..."
                        : "Join the waitlist"}
                    </Button>
                  </Form>

                  <div id="form-error-message" className="mt-6 text-center">
                    {actionData?.formError ? (
                      <>
                        <p className="mt-3 text-sm text-slate-900" role="alert">
                          {actionData?.formError}
                        </p>
                      </>
                    ) : null}
                  </div>
                </div>

                <p className="mt-12 text-center text-sm text-slate-900">
                  Already have an account?{" "}
                  <Link
                    to={`/auth/login`}
                    className="text-sm font-medium text-slate-700 hover:text-slate-900"
                  >
                    Sign in
                  </Link>{" "}
                  instead!
                </p>
              </div>
            </div>
            <div className="mt-12 hidden lg:relative lg:m-0 lg:block">
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6  lg:px-0">
                <img
                  className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full "
                  src={illustration}
                  alt="Woman looking at a plant made of circles and squares."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
