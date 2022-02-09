import type { LoaderFunction } from "remix";
import { useLoaderData } from "remix";

import Footer from "~/components/Footer";
import Header from "~/components/Header";

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
    <div className="relative bg-slate-50">
      <Header isUserLoggedIn={data.isUserLoggedIn} />

      <main className="mx-auto max-w-7xl px-8">
        <p>Terms</p>
      </main>

      <Footer />
    </div>
  );
}
