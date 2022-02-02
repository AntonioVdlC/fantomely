import type { LoaderFunction } from "remix";
import { useLoaderData } from "remix";

import { getUserId } from "~/utils/session.server";
import Header from "~/components/Header";
import LandingHero from "~/components/LandingHero";

type LoaderData = {
  isUserLoggedIn: boolean;
  navigation: Array<{ name: string; href: string }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  return {
    isUserLoggedIn: Boolean(userId),
    navigation: [
      { name: "Docs", href: "/docs" },
      { name: "Pricing", href: "/pricing" },
      { name: "Contribute", href: "https://github.com" },
    ],
  };
};

export default function LandingScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="relative">
      <Header
        navigation={data.navigation}
        isUserLoggedIn={data.isUserLoggedIn}
      />

      <main>
        <LandingHero />

        {/* More main page content here... */}
      </main>
    </div>
  );
}
