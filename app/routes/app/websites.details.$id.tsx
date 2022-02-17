import { useState } from "react";
import { useLoaderData, Link, Form, useTransition } from "remix";
import {
  ExternalLinkIcon,
  ClipboardCopyIcon,
  ClipboardCheckIcon,
} from "@heroicons/react/outline";
import { Role } from "@prisma/client";

import type { LoaderFunction, ActionFunction } from "remix";
import type { Org, User, UserOrg, Website } from "@prisma/client";

import classNames from "~/utils/class-names";
import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";
import { generateWebsiteColor, generateWebsiteInitials } from "~/utils/website";

import H2 from "~/components/SectionHeader";
import Button from "~/components/Button";
import LayoutGrid from "~/components/LayoutGrid";

type LoaderData = {
  user: User & {
    orgs: (UserOrg & {
      org: Org;
    })[];
  };
  website: Website;
  origin: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await requireCurrentUser(request);
  const website = await db.website.findUnique({ where: { id: params.id } });

  return { website, user, origin: process.env.BASE_URL };
};

export const action: ActionFunction = async ({ params, request }) => {
  const user = await requireCurrentUser(request);
  const website = await db.website.findUnique({ where: { id: params.id } });

  if (!website) {
    throw new Response("Website not found", { status: 404 });
  }

  if (
    user.currentOrg.id !== website.orgId &&
    ![Role.ADMIN.toString(), Role.OWNER.toString()].includes(
      user.currentOrg.role
    )
  ) {
    throw new Response("", { status: 403 });
  }

  const form = await request.formData();

  const ignoreQueryString = Boolean(form.get("ignore-query-string"));

  await db.website.update({
    data: { ignoreQueryString },
    where: { id: website.id },
  });

  return null;
};

export default function WebsiteDetailsRoute() {
  const data = useLoaderData<LoaderData>();
  const script = `<script defer src="${data.origin}/sdk/browser.js" data-fantomely data-h="${data.origin}" data-k="${data.website.publicKey}"></script>`;

  const [copiedScriptToClipboard, setCopiedScriptToClipboard] = useState(false);

  function copyScriptToClipboard() {
    navigator.clipboard.writeText(script).then(() => {
      setCopiedScriptToClipboard(true);
      setTimeout(() => setCopiedScriptToClipboard(false), 5000);
    });
  }

  const transition = useTransition();

  return (
    <>
      <div>
        <H2>Website Details</H2>
      </div>
      <div className="mt-3">
        <LayoutGrid>
          <div className="flex">
            <div
              className={classNames(
                generateWebsiteColor(data.website.name),
                "flex w-16 flex-shrink-0 items-center justify-center rounded-md text-2xl font-medium text-white shadow-sm"
              )}
            >
              {generateWebsiteInitials(data.website.name)}
            </div>
            <div className="ml-2">
              <label
                htmlFor="name"
                className="block text-left text-sm font-medium text-slate-700"
              >
                Name
              </label>
              <p id="name">{data.website.name}</p>
            </div>
          </div>
          <div>
            <label
              htmlFor="link"
              className="block text-left text-sm font-medium text-slate-700"
            >
              Link
            </label>
            <a
              id="link"
              href={data.website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex content-center text-slate-500 hover:text-slate-600 hover:underline"
            >
              {data.website.url}{" "}
              <ExternalLinkIcon className="ml-1 mt-1 h-4 w-4" />
            </a>
          </div>
        </LayoutGrid>
      </div>

      <div className="mt-3">
        <label
          htmlFor="key"
          className="block text-left text-sm font-medium text-slate-700"
        >
          Public Key
        </label>
        <p id="key" style={{ overflowWrap: "anywhere" }}>
          {data.website.publicKey}
        </p>
      </div>

      <div className="mt-3">
        <label
          htmlFor="script"
          className="block text-left text-sm font-medium text-slate-700"
        >
          Tracking Script
        </label>
        <p>To start tracking, please add the following line to your website:</p>

        <p
          className="relative mt-3 max-w-5xl bg-slate-100 p-4 pr-10 text-sm"
          style={{ overflowWrap: "anywhere" }}
        >
          <span className="absolute top-0 right-0 m-2">
            {copiedScriptToClipboard ? (
              <span title="Copied">
                <ClipboardCheckIcon className="inline h-4 w-4 text-green-600" />
              </span>
            ) : (
              <span
                title="Copy to clipboard"
                onClick={() => copyScriptToClipboard()}
              >
                <ClipboardCopyIcon className="inline h-4 w-4 cursor-pointer text-slate-700 hover:text-slate-800" />
              </span>
            )}
          </span>
          <code id="script">{script}</code>
        </p>
        <p className="mt-3 text-sm">
          <Link to="/docs">Need help?</Link>
        </p>
      </div>

      <hr className="my-6" />

      <H2>Website Settings</H2>
      <div className="mt-5">
        <Form method="post">
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="ignore-query-string"
                aria-describedby="ignore-query-string-description"
                name="ignore-query-string"
                type="checkbox"
                defaultChecked={data.website.ignoreQueryString}
                className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="ignore-query-string"
                className="font-medium text-slate-700"
              >
                Ignore query string
              </label>
              <p
                id="ignore-query-string-description"
                className="text-slate-500"
              >
                Don't track changes in query string values.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <LayoutGrid>
              <Button
                type="submit"
                primary
                loading={Boolean(transition.submission)}
              >
                {transition.submission ? "Updating ..." : "Update Settings"}
              </Button>
            </LayoutGrid>
          </div>
        </Form>
      </div>
    </>
  );
}
