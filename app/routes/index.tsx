import { User } from "@prisma/client";
import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { Link } from "remix";
import { getUserId } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return {
    title: "Analytics Service",
    description: "Some description of the analytics service",
  };
};

type LoaderData = {
  userId: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = getUserId(request);

  const data = { userId };

  return data;
};

export default function LandingScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <div>
        <h1>Analytics Service</h1>
        <nav>
          <ul>
            {data.userId ? (
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
