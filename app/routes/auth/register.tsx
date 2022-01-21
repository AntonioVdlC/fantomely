import { Link } from "react-router-dom";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  useSearchParams,
} from "remix";
import { Form, useActionData, redirect, json } from "remix";
import { db } from "~/utils/db.server";

import isEmailValid from "~/utils/is-email-valid";
import { createUserSession, getUserId, register } from "~/utils/session.server";

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
  if (typeof email !== "string" || !isEmailValid(email)) {
    return `The email is invalid`;
  }
}

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
    email: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
  };
  fields?: {
    email: string;
    firstName: string;
    lastName: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const firstName = form.get("first-name");
  const lastName = form.get("last-name");
  if (
    typeof email !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { email, firstName, lastName };
  const fieldErrors = {
    email: validateEmail(email),
    firstName: validateFirstName(firstName),
    lastName: validateLastName(lastName),
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
  const user = await register({ email, firstName, lastName });
  if (!user) {
    return badRequest({
      fields,
      formError: `User already exists`,
    });
  }

  return createUserSession(user, `/auth/onboarding`);
};

export default function RegisterRoute() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

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
            defaultValue={
              actionData?.fields?.email ||
              searchParams.get("email") ||
              undefined
            }
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
        <div id="form-error-message">
          {actionData?.formError ? (
            <>
              <p className="form-validation-error" role="alert">
                {actionData?.formError}
              </p>
              <Link
                to={`/auth/login?email=${actionData?.fields?.email || ""}`}
              >
                Sign in instead!
              </Link>
            </>
          ) : null}
        </div>
        <button type="submit" className="button">
          Register
        </button>
      </Form>
    </div>
  );
}
