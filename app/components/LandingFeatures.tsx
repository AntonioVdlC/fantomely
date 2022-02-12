import {
  AdjustmentsIcon,
  EyeOffIcon,
  LightningBoltIcon,
  PresentationChartLineIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";

import type { FC } from "react";

type FeatureItem = { name: string; description: string; Icon: FC<any> };

export default function LandingFeatures() {
  const features: FeatureItem[] = [
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
    <div className="relative bg-slate-50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base font-semibold uppercase tracking-wider text-slate-500">
          Private by design
        </h2>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          A better way to collect web analytics
        </p>
        <p className="mx-auto mt-5 max-w-prose text-xl text-slate-500">
          We started this product from our own experience and pain points trying
          to find a holistic and affordable web analytics solution that respects
          people's privacy.
        </p>
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, ...feature }) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root rounded-lg bg-slate-100 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-slate-500 p-3 shadow-lg">
                        <Icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-slate-900">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
