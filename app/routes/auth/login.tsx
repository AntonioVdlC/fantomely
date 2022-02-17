import {
  Form,
  Link,
  json,
  redirect,
  useActionData,
  useSearchParams,
  useTransition,
} from "remix";

import type { ActionFunction, LoaderFunction } from "remix";

import { generateMagicLink, getUserId } from "~/utils/session.server";
import { isValidEmail } from "~/utils/is-valid";
import { send, templates } from "~/utils/email.server";

import Button from "~/components/Button";
import Logo from "~/components/Logo";

import illustration from "~/assets/illustration_login.svg";

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
  const redirectTo = form.get("redirectTo") || "/app";

  if (typeof email !== "string" || typeof redirectTo !== "string") {
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

  const magicLink = await generateMagicLink(email);
  if (!magicLink) {
    return badRequest({
      fields,
      formError: `Unable to find a user with that email.`,
    });
  }

  // Send magic link
  try {
    await send({
      from: "fantomely <no-reply@fantomely.com>",
      to: email,
      subject: "Login to fantomely! 👻",
      html: templates.login({
        link: `${
          process.env.BASE_URL
        }/auth/login/callback?email=${encodeURIComponent(email)}&token=${
          magicLink.token
        }&redirectTo=${redirectTo}`,
      }),
      text: `Log into fantomely!
          Here is your magic link to log into your fantomely account: ${
            process.env.BASE_URL
          }/auth/login/callback?email=${encodeURIComponent(email)}&token=${
        magicLink.token
      }&redirectTo=${redirectTo}`,
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error(error);
  }

  return redirect(
    `/auth/login/sent?email=${encodeURIComponent(
      email
    )}&redirectTo=${redirectTo}`
  );
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const transition = useTransition();

  return (
    <div className="w-screen">
      <div className="bg-slate-50 pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14">
        <div className="mx-auto max-w-7xl px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="mx-auto max-w-sm px-4 sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
              <div className="lg:py-24">
                <div className="flex justify-center">
                  <Logo size="lg" withLink />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                  Sign in to your account
                </h2>
                <p className="mt-3  text-center  text-sm text-slate-900">
                  We will send you a link to your email address to sign in.
                </p>
                <div className="mt-10 sm:mt-12">
                  <Form
                    className="space-y-6"
                    method="post"
                    aria-describedby={
                      actionData?.formError ? "form-error-message" : undefined
                    }
                  >
                    <input
                      type="hidden"
                      name="redirectTo"
                      value={searchParams.get("redirectTo") ?? ""}
                    />
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
                          defaultValue={
                            actionData?.fields?.email ||
                            searchParams.get("email") ||
                            ""
                          }
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
                      Submit
                    </Button>
                  </Form>

                  <div id="form-error-message">
                    {actionData?.formError ? (
                      <>
                        <p className="mt-3 text-sm text-slate-900" role="alert">
                          {actionData?.formError}
                        </p>
                        <p className="text-sm text-slate-900">
                          Don't have an account yet?{" "}
                          <Link
                            to={`/auth/register?email=${
                              actionData?.fields?.email ?? ""
                            }`}
                            className="text-sm font-medium text-slate-700 hover:text-slate-900"
                          >
                            Register
                          </Link>{" "}
                          instead!
                        </p>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 hidden lg:relative lg:m-0 lg:block">
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
  );
}
