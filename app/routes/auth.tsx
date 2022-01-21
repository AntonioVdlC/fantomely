import { Outlet } from "remix";

export default function AuthRoute() {
  return (
    <>
      <p>Auth Route</p>
      <Outlet />
    </>
  );
}
