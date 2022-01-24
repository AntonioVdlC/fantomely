import { LoaderFunction } from "remix";
import fs from "fs";
import path from "path";
import { db } from "~/utils/db.server";
import { isValidURL } from "~/utils/is-valid";

const sdkFile = fs.readFileSync(path.join(__dirname, "./sdk/web.js"));

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const publicKey = url.searchParams.get("publicKey");

  if (!publicKey) {
    throw new Error("Could not determine public key.");
  }

  // Check that the public and origin match
  const existingWebsite = await db.website.findFirst({
    where: { publicKey },
  });

  if (!existingWebsite) {
    throw new Error("Could not determine tracked website.");
  }

  const sdkString = sdkFile.toString().replace("%PUBLIC_KEY%", publicKey);

  return new Response(sdkString, {
    headers: {
      "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      "Content-Type": "text/javascript",
      "Content-Length": String(Buffer.byteLength(sdkString)),
    },
  });
};
