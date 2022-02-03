import type { ActionFunction, LoaderFunction } from "remix";
import { Form, useActionData, redirect, json, Link } from "remix";
import Button from "~/components/Button";
import Logo from "~/components/Logo";

import { db } from "~/utils/db.server";
import { isValidEmail } from "~/utils/is-valid";
import { getUserId, joinWaitlist } from "~/utils/session.server";

import illustration from "~/assets/illustration_waitlist.svg";

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

  return redirect(`/auth/waitlist/sent?email=${email}`);
};

export default function RegisterRoute() {
  const actionData = useActionData<ActionData>();

  return (
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
                          className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
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

                    <Button primary type="submit">
                      Join the waitlist
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
            <div className="mt-12 hidden lg:block lg:m-0 lg:relative">
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
