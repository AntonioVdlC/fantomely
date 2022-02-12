import { Outlet } from "remix";

export default function AuthRoute() {
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center overflow-hidden bg-slate-50">
        <Outlet />
      </div>
    </>
  );
}
