import {
  ExternalLinkIcon,
  ClipboardCopyIcon,
  ClipboardCheckIcon,
} from "@heroicons/react/outline";
import { Org, User, UserOrg, Website } from "@prisma/client";
import { useState } from "react";
import { LoaderFunction, useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";

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

  return { website, user, origin: new URL(request.url).origin };
};

export default function WebsiteDetailsRoute() {
  const data = useLoaderData<LoaderData>();
  const script = `<script async src="${data.origin}/sdk/browser.js" data-fantomely data-h="${data.origin}" data-k="${data.website.publicKey}"></script>`;

  const [copiedScriptToClipboard, setCopiedScriptToClipboard] = useState(false);

  function copyScriptToClipboard() {
    navigator.clipboard.writeText(script).then(() => {
      setCopiedScriptToClipboard(true);
      setTimeout(() => setCopiedScriptToClipboard(false), 5000);
    });
  }

  return (
    <>
      <div>
        <h2 className="text-slate-500 text-xs font-medium uppercase tracking-wide">
          Website Details
        </h2>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm text-left font-medium text-slate-700"
          >
            Name
          </label>
          <p id="name">{data.website.name || data.website.url}</p>
        </div>
        <div>
          <label
            htmlFor="link"
            className="block text-sm text-left font-medium text-slate-700"
          >
            Link
          </label>
          <a
            id="link"
            href={data.website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-600 hover:underline flex content-center"
          >
            {data.website.url}{" "}
            <ExternalLinkIcon className="ml-1 mt-1 h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-3">
        <label
          htmlFor="key"
          className="block text-sm text-left font-medium text-slate-700"
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
          className="block text-sm text-left font-medium text-slate-700"
        >
          Tracking Script
        </label>
        <p>To start tracking, please add the following line to your website:</p>

        <p className="bg-slate-100 p-4 pr-10 text-sm relative max-w-5xl mt-3">
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
                <ClipboardCopyIcon className="cursor-pointer inline h-4 w-4 text-slate-700 hover:text-slate-800" />
              </span>
            )}
          </span>
          <code id="script">{script}</code>
        </p>
        <p className="mt-3">
          <Link to="/docs">Need help?</Link>
        </p>
      </div>
    </>
  );
}
