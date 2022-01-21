import type { MetaFunction } from "remix";
import { Link } from "remix";

export const meta: MetaFunction = () => {
  return {
    title: "Analytics Service",
    description: "Some description of the analytics service",
  };
};

export default function LandingScreen() {
  return (
    <div>
      <div>
        <h1>Analytics Service</h1>
        <nav>
          <ul>
            <li>
              <Link to="/auth/login">Sign In</Link>
            </li>
            <li>
              <Link to="/auth/register">Create Account</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
