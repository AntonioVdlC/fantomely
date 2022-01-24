import { EventType } from "@prisma/client";
import { json, ActionFunction } from "remix";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const origin = request.headers.get("Origin");
  const payload = await request.json();

  const website = await db.website.findFirst({
    where: { publicKey: payload.publicKey },
  });

  if (!website || website.url !== origin) {
    throw new Response("Error while ingesting event. Website not found.", {
      status: 404,
    });
  }

  // Save event in database
  const event = await db.event.create({
    data: {
      websiteId: website.id,
      path: payload.path,
      type: EventType.PAGEVIEW,
    },
  });

  return new Response("ok", {
    headers: {
      "Access-Control-Allow-Origin": website.url,
    },
  });
};
