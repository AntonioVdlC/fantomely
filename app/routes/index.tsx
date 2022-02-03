import type { LoaderFunction } from "remix";
import { useLoaderData } from "remix";

import { getUserId } from "~/utils/session.server";
import Header from "~/components/Header";
import LandingHero from "~/components/LandingHero";
import Footer from "~/components/Footer";
import type { SocialPlatform } from "~/components/FooterSocial";
import LandingCTA from "~/components/LandingCTA";

type LoaderData = {
  isUserLoggedIn: boolean;
  navigation: Array<{ name: string; href: string }>;
  footerNavigation: {
    main: Array<{ name: string; href: string }>;
    social: Array<{ name: SocialPlatform; href: string }>;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  return {
    isUserLoggedIn: Boolean(userId),
    navigation: [
      { name: "About", href: "/about" },
      { name: "Docs", href: "/docs" },
      { name: "Pricing", href: "/pricing" },
      { name: "Contribute", href: "https://github.com" },
    ],
    footerNavigation: {
      main: [
        { name: "About", href: "/about" },
        { name: "Docs", href: "/docs" },
        { name: "Pricing", href: "/pricing" },
        { name: "Terms", href: "/terms" },
      ],
      social: [
        {
          name: "twitter",
          href: "https://twitter.com",
        },
        {
          name: "github",
          href: "https://github.com/",
        },
      ],
    },
  };
};

export default function LandingScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="relative bg-slate-50">
      <Header
        navigation={data.navigation}
        isUserLoggedIn={data.isUserLoggedIn}
      />

      <main>
        <LandingHero />
        <LandingCTA />
      </main>

      <Footer
        navigation={data.footerNavigation.main}
        social={data.footerNavigation.social}
      />
    </div>
  );
}
