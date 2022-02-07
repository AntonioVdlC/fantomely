import { ActionFunction, redirect } from "remix";

import { db } from "~/utils/db.server";
import { generatePublicKey } from "~/utils/api.server";
import { isValidURL } from "~/utils/is-valid";
import { requireCurrentUser } from "~/utils/session.server";

function validateURL(url: unknown) {
  if (typeof url !== "string" || !isValidURL(url)) {
    return `The URL is invalid`;
  }
}

export const action: ActionFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  const form = await request.formData();

  // Validate form
  const url = form.get("url");
  const name = form.get("name") || "";
  if (typeof url !== "string" || typeof name !== "string") {
    throw new Response("Form inputs are not correct.", { status: 400 });
  }

  if (!validateURL(url)) {
    throw new Response("Link is not valid.", { status: 400 });
  }

  // Get URL origin and name
  const origin = new URL(url).origin;

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
      name: name || origin,
      url: origin,
      publicKey,
      createdById: user.id,
      orgId: user.currentOrg.id,
    },
  });

  return redirect(`/app/websites/details/${website.id}`);
};
