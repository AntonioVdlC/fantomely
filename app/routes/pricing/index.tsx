import { Outlet } from "remix";

export default function PricingRoute() {
  return (
    <div>
      This is the pricing!
      <Outlet />
    </div>
  );
}
