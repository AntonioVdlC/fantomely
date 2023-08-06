import { getUserId } from "~/utils/session.server";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import LandingCTA from "~/components/LandingCTA";
import LandingFeatures from "~/components/LandingFeatures";
import LandingHero from "~/components/LandingHero";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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

      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingCTA />
      </main>

      <Footer />
    </div>
  );
}
