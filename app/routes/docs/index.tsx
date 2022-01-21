import { Outlet } from "remix";

export default function DocsRoute() {
  return (
    <div>
      This is the docs!
      <Outlet />
    </div>
  );
}
