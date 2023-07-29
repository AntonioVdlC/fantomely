import type { User } from "@prisma/client";

import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";

import H2 from "~/components/SectionHeader";
import LayoutGrid from "~/components/LayoutGrid";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, Form, useTransition } from "@remix-run/react";

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);

  return { user };
};

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
    firstName: string | undefined;
    lastName: string | undefined;
  };
  fields?: {
    firstName: string;
    lastName: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const user = await requireCurrentUser(request);
  const form = await request.formData();

  const firstName = form.get("first-name");
  const lastName = form.get("last-name");
  if (typeof firstName !== "string" || typeof lastName !== "string") {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { firstName, lastName };
  const fieldErrors = {
    firstName: validateFirstName(firstName),
    lastName: validateLastName(lastName),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  try {
    await db.user.update({
      data: { firstName, lastName },
      where: { id: user.id },
    });

    return {};
  } catch {
    throw new Response("Something went wrong trying to update user.", {
      status: 500,
    });
  }
};

export default function AppUserRoute() {
  const data = useLoaderData<LoaderData>();
  const transition = useTransition();

  return (
    <>
      <H2>User Information</H2>

      <div className="mt-3"></div>

      <Form method="post">
        <LayoutGrid>
          <Input
            type="email"
            id="email"
            name="email"
            label="Email"
            placeholder="jane.doe@email.com"
            defaultValue={data.user.email}
            disabled
          />
          <Input
            type="text"
            id="first-name"
            name="first-name"
            label="First Name"
            placeholder="Jane"
            defaultValue={data.user.firstName || ""}
            required
          />
          <Input
            type="text"
            id="last-name"
            name="last-name"
            label="Last Name"
            placeholder="Doe"
            defaultValue={data.user.lastName || ""}
            required
          />
        </LayoutGrid>

        <div className="mt-3"></div>

        <LayoutGrid>
          <Button
            type="submit"
            primary
            loading={Boolean(transition.submission)}
          >
            {transition.submission ? "Updating ..." : "Update"}
          </Button>
        </LayoutGrid>
      </Form>
    </>
  );
}
