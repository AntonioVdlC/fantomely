import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import { Outlet } from "@remix-run/react";

import { requireAdminSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const adminSession = await requireAdminSession(request);

  if (!adminSession?.token) {
    return redirect("/admin/login");
  }

  return redirect("/admin/dashboard");
};

export default function AdminIndexRoute() {
  return (
    <>
      <p>Admin</p>
      <Outlet />
    </>
  );
}
