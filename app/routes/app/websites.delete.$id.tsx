import { redirect } from "@remix-run/node";
import { Role } from "@prisma/client";

import type { ActionFunction } from "@remix-run/node";

import { db } from "~/utils/db.server";
import { requireCurrentUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ params, request }) => {
  const user = await requireCurrentUser(request);

  if (
    ![Role.ADMIN.toString(), Role.OWNER.toString()].includes(
      user.currentOrg.role
    )
  ) {
    throw new Response("Cannot delete website " + params.id, { status: 403 });
  }

  await db.website.update({
    data: { isActive: false },
    where: { id: params.id },
  });

  return redirect("/app/websites");
};
