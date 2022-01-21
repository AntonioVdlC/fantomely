import type { ActionFunction, MetaFunction } from "remix";
import { useActionData, json, Link, Form, useSearchParams } from "remix";
import { db } from "~/utils/db.server";
import { createUserSession, login } from "~/utils/session.server";
import isEmailValid from "~/utils/is-email-valid";

export const meta: MetaFunction = () => {
  return {
    title: "Analytics Service | Login",
    description: "Login to Analytics Service!",
  };
};

function validateEmail(email: unknown) {
  if (typeof email !== "string" || !isEmailValid(email)) {
    return `The email is invalid`;
  }
}

// function validateFirstName(firstName: unknown) {
//   if (typeof firstName !== "string" || firstName.length < 1) {
//     return `First names must be at least 1 character long`;
//   }
// }

// function validateLastName(lastName: unknown) {
//   if (typeof lastName !== "string" || lastName.length < 1) {
//     return `Last names must be at least 1 character long`;
//   }
// }

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
  const otp = form.get("otp");
  const redirectTo = form.get("redirectTo") || "/jokes";
  if (
    typeof email !== "string" ||
    typeof otp !== "string" ||
    typeof redirectTo !== "string"
  ) {
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

  const user = await login({ email, otp });
  if (!user) {
    return badRequest({
      fields,
      formError: `Username/Password combination is incorrect`,
    });
  }
  return createUserSession(user.id, redirectTo);

  // case "register": {
  //   const userExists = await db.user.findFirst({
  //     where: { username },
  //   });
  //   if (userExists) {
  //     return badRequest({
  //       fields,
  //       formError: `User with username ${username} already exists`,
  //     });
  //   }
  //   const user = await register({ username, password });
  //   if (!user) {
  //     return badRequest({
  //       fields,
  //       formError: `Something went wrong trying to create a new user.`,
  //     });
  //   }
  // }
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
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === "register"}
              />{" "}
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-describedby={
                actionData?.fieldErrors?.username ? "username-error" : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData?.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              defaultValue={actionData?.fields?.password}
              type="password"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.password) || undefined
              }
              aria-describedby={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData?.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData?.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </Form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
