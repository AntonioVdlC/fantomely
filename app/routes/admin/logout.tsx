import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";

import { logoutAdmin } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  return logoutAdmin(request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
