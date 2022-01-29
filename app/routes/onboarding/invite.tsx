import { Plan } from "@prisma/client";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
import { isValidEmail } from "~/utils/is-valid";
import { requireCurrentUser } from "~/utils/session.server";

type LoaderData = {
  plan: Plan;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);
  const subscription = await db.subscription.findFirst({
    where: { orgId: user.currentOrg.id, createdById: user.id },
    include: { plan: true },
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const data = { plan: subscription.plan };

  return data;
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    invites: string | undefined;
  };
  fields?: {
    invites: string;
  };
};

function validateInvites(invites: string[]) {
  if (!invites.length) {
    return `No invites`;
  }
  if (invites.some((invite) => !isValidEmail(invite))) {
    return `Some emails are invalid. Please double-check!`;
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  const form = await request.formData();
  const action = form.get("action");

  if (action === "skip") {
    await db.user.update({
      data: { isOnboarded: true },
      where: { id: user.id },
    });

    return redirect("/app");
  }

  const invites = form.get("invites")?.toString()?.split(",");

  if (!Array.isArray(invites) || !invites.length) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { invites: invites.join(",") };
  const fieldErrors = {
    invites: validateInvites(invites),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  // TODO: create invites

  await db.user.update({
    data: { isOnboarded: true },
    where: { id: user.id },
  });

  return redirect("/app");
};

export default function OnboardingInviteRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <>
      <div>TODO</div>

      <p>Invite people (max. {data.plan.includeUsersMax - 1})</p>
      <Form method="post">
        <label htmlFor="invites">Invites:</label>
        <textarea
          id="invites"
          name="invites"
          defaultValue={actionData?.fields?.invites}
        ></textarea>
        <button type="submit" name="action" value="skip">
          Skip
        </button>
        <button type="submit" name="action" value="create">
          Create
        </button>
      </Form>
    </>
  );
}
