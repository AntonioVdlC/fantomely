import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import {
  Form,
  useActionData,
  redirect,
  json,
  useSearchParams,
  Link,
} from "remix";

import { db } from "~/utils/db.server";
import { isValidEmail } from "~/utils/is-valid";
import {
  generateMagicLink,
  getUserId,
  joinWaitlist,
  register,
} from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return {
    title: "Analytics Service | Register",
    description: "Register to Analytics Service!",
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
  if (typeof email !== "string") {
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
    <div>
      <Form
        method="post"
        aria-describedby={
          actionData?.formError ? "form-error-message" : undefined
        }
      >
        <div>
          <label htmlFor="email-input">Email</label>
          <input
            type="email"
            id="email-input"
            name="email"
            defaultValue={actionData?.fields?.email}
            aria-invalid={Boolean(actionData?.fieldErrors?.email)}
            aria-describedby={
              actionData?.fieldErrors?.email ? "email-error" : undefined
            }
          />
          {actionData?.fieldErrors?.email ? (
            <p className="form-validation-error" role="alert" id="email-error">
              {actionData?.fieldErrors.email}
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
              <Link to={`/auth/login?email=${actionData?.fields?.email || ""}`}>
                Sign in instead!
              </Link>
            </>
          ) : null}
        </div>
        <button type="submit" className="button">
          Join the waitlist
        </button>
      </Form>
    </div>
  );
}
