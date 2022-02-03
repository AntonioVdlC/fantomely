import type { LoaderFunction } from "remix";
import { useLoaderData } from "remix";

import { getUserId } from "~/utils/session.server";
import Header from "~/components/Header";
import LandingHero from "~/components/LandingHero";
import Footer from "~/components/Footer";
import type { SocialPlatform } from "~/components/FooterSocial";
import LandingCTA from "~/components/LandingCTA";

import {
  AdjustmentsIcon,
  EyeOffIcon,
  LightningBoltIcon,
  PresentationChartLineIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";

import LandingFeatures from "~/components/LandingFeatures";

type FooterNavigation = {
  main: Array<{ name: string; href: string }>;
  social: Array<{ name: SocialPlatform; href: string }>;
};

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

  const navigation = [
    { name: "Docs", href: "/docs" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contribute", href: "https://github.com" },
  ];

  const footerNavigation: FooterNavigation = {
    main: [
      { name: "About", href: "/about" },
      { name: "Docs", href: "/docs" },
      { name: "Pricing", href: "/pricing" },
      { name: "Status", href: "/status" },
      { name: "Terms", href: "/terms" },
      { name: "Licence", href: "/licence" },
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
  };

  const features = [
    {
      name: "Private by design",
      description:
        "We only store aggregate data from your users' behavior on your website, which makes our analytics private by design.",
      Icon: EyeOffIcon,
    },
    {
      name: "Cookie-free",
      description:
        "We are not tracking your users individually, which means no cookie banners needed, but more cookies for you!",
      Icon: ShieldCheckIcon,
    },
    {
      name: "Blazing fast",
      description:
        "Our analytics script is a handful of lines, and weights less than 1Kb. We kept nothing but the essentials!",
      Icon: LightningBoltIcon,
    },
    {
      name: "Open source",
      description:
        "All the code (including this very page) is open source and can be independently audited and freely self-hosted.",
      Icon: ScaleIcon,
    },
    {
      name: "Powerful analytics",
      description:
        "We provide meaningful analytics while protecting your users' privacy. Who said you can't have both?",
      Icon: PresentationChartLineIcon,
    },
    {
      name: "Easy integration",
      description:
        "Integrate our script on any website or web app with a single line of code. That's it, you're good to go!",
      Icon: AdjustmentsIcon,
    },
  ];

  return (
    <div className="relative bg-slate-50">
      <Header navigation={navigation} isUserLoggedIn={data.isUserLoggedIn} />

      <main>
        <LandingHero />
        <LandingFeatures features={features} />
        <LandingCTA />
      </main>

      <Footer
        navigation={footerNavigation.main}
        social={footerNavigation.social}
      />
    </div>
  );
}
