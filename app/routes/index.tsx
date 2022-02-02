import type { LoaderFunction } from "remix";
import { Link, useLoaderData } from "remix";

import { getUserId } from "~/utils/session.server";

type LoaderData = {
  isUserLoggedIn: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  return {
    isUserLoggedIn: Boolean(userId),
  };
};

export default function LandingScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <div>
        <h1>Analytics Service</h1>
        <nav>
          <ul>
            {data.isUserLoggedIn ? (
              <li>
                <Link to="/app">Go to App</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/auth/login">Sign In</Link>
                </li>
                <li>
                  <Link to="/auth/register">Create Account</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
