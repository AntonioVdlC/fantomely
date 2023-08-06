import { redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { logoutAdmin } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  return logoutAdmin(request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
