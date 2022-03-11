import { useLoaderData } from "remix";

import type { LoaderFunction } from "remix";

import { getUserId } from "~/utils/session.server";

import Footer from "~/components/Footer";
import Header from "~/components/Header";

type LoaderData = {
  isUserLoggedIn: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  return {
    isUserLoggedIn: Boolean(userId),
  };
};

export default function HowItWorksScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="relative bg-slate-50">
      <Header isUserLoggedIn={data.isUserLoggedIn} />

      <main className="mx-auto max-w-7xl px-8">
        <p>How</p>
      </main>

      <Footer />
    </div>
  );
}
