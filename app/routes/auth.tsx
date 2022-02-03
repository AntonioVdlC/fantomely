import { Outlet } from "remix";

export default function AuthRoute() {
  return (
    <>
      <div className="h-screen bg-slate-50 flex flex-col justify-center items-center overflow-hidden">
        <Outlet />
      </div>
    </>
  );
}
