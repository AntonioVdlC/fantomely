import { Link } from "react-router-dom";
import { LoaderFunction, redirect, useSearchParams } from "remix";
import { getUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    // Redirect to the home page if they are already signed in.
    return redirect("/app");
  }

  return null;
};

export default function LoginSentRoute() {
  const [searchParams] = useSearchParams();

  return (
    <>
      <p>An email has been sent to {searchParams.get("email")}</p>
      <p>
        Can't find the email? Try{" "}
        <Link to={`/login?redirectTo=${searchParams.get("redirectTo")}`}>
          signing in
        </Link>{" "}
        again!
      </p>
    </>
  );
}
