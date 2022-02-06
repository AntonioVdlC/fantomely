import { ActionFunction, Form, json, redirect, useActionData } from "remix";

import { db } from "~/utils/db.server";
import { generatePublicKey } from "~/utils/api.server";
import { isValidURL } from "~/utils/is-valid";
import { requireCurrentUser } from "~/utils/session.server";
import { Website } from "@prisma/client";

function validateURL(url: unknown) {
  if (typeof url !== "string" || !isValidURL(url)) {
    return `The URL is invalid`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    url: string | undefined;
  };
  fields?: {
    url: string;
  };
  response?: {
    success: boolean;
    website: Website;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  const form = await request.formData();

  // Validate form
  const url = form.get("url");
  if (typeof url !== "string") {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { url };
  const fieldErrors = {
    url: validateURL(url),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  // Get URL origin
  const origin = new URL(url).origin;
  fields.url = origin;

  // Check URL not created in this account yet
  const existingWebsite = await db.website.findFirst({
    where: { url: origin, createdById: user.id, orgId: user.currentOrg.id },
  });
  if (existingWebsite) {
    return redirect(`/app/websites/details/${existingWebsite.id}`);
  }

  // TODO: check website limit according to current plan

  // Generate new API public key
  const publicKey = generatePublicKey();

  // Save new website config in database
  const website = await db.website.create({
    data: {
      url: origin,
      publicKey,
      createdById: user.id,
      orgId: user.currentOrg.id,
    },
  });

  const response = {
    success: true,
    website,
  };

  const data = { fields, fieldErrors, response };

  return data;
};

export default function WebsiteCreateRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <>
      <p>Website Create</p>
      <Form method="post">
        <label htmlFor="url">URL</label>
        <input
          type="text"
          name="url"
          id="url"
          defaultValue={actionData?.fields?.url}
          aria-invalid={Boolean(actionData?.fieldErrors?.url)}
          aria-describedby={
            actionData?.fieldErrors?.url ? "url-error" : undefined
          }
          disabled={Boolean(actionData?.response?.success)}
        ></input>
        {actionData?.fieldErrors?.url ? (
          <p className="form-validation-error" role="alert" id="url-error">
            {actionData?.fieldErrors?.url}
          </p>
        ) : null}
        <button type="submit">Create</button>
      </Form>
      {actionData?.response?.success ? (
        <div>
          <p>
            Website{" "}
            <a
              href={actionData?.fields?.url}
              rel="noopener noreferrer"
              target={"_blank"}
            >
              {actionData?.fields?.url}
            </a>{" "}
            successfully added.
          </p>

          <p>
            To start tracking, please add the following line to your website:
          </p>

          <code>
            {`<script async src="${window?.location?.origin}/sdk/browser.js" data-fantomely data-h="${window?.location?.origin}" data-k="${actionData?.response?.website?.publicKey}"></script>`}
          </code>
        </div>
      ) : null}
    </>
  );
}
