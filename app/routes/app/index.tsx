import { Outlet } from "remix";

export default function AppRoute() {
  return (
    <div>
      This is the app!
      <Outlet />
    </div>
  );
}
