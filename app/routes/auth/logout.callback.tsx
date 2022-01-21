import { Link } from "remix";

export default function LogoutCallbackRouter() {
  return (
    <>
      <p>Logged out successfully!</p>
      <Link to="/">Home</Link>
    </>
  );
}
