import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import {
  Form,
  Link,
  json,
  redirect,
  useActionData,
  useSearchParams,
} from "remix";

import { generateMagicLink, getUserId } from "~/utils/session.server";
import isEmailValid from "~/utils/is-email-valid";

export const meta: MetaFunction = () => {
  return {
    title: "Analytics Service | Login",
    description: "Login to Analytics Service!",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    // Redirect to the home page if they are already signed in.
    return redirect("/app");
  }

  return null;
};

function validateEmail(email: unknown) {
  if (typeof email !== "string" || !isEmailValid(email)) {
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

  // TODO: send email
  console.log(
    `/auth/login/callback?email=${email}&token=${magicLink.token}&redirectTo=${redirectTo}`
  );

  return redirect(`/auth/login/sent?email=${email}&redirectTo=${redirectTo}`);
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <Form
          method="post"
          aria-describedby={
            actionData?.formError ? "form-error-message" : undefined
          }
        >
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <div>
            <label htmlFor="email-input">Email</label>
            <input
              type="text"
              id="email-input"
              name="email"
              defaultValue={
                actionData?.fields?.email ||
                searchParams.get("email") ||
                ""
              }
              aria-invalid={Boolean(actionData?.fieldErrors?.email)}
              aria-describedby={
                actionData?.fieldErrors?.email ? "email-error" : undefined
              }
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
          <div id="form-error-message">
            {actionData?.formError ? (
              <div className="form-validation-error" role="alert">
                {actionData?.formError}
                <div>
                  Don't have an account yet?
                  <Link
                    to={`/auth/register?email=${
                      actionData?.fields?.email ?? ""
                    }`}
                  >
                    Register instead!
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
}
