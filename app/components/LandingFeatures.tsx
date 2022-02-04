import type { FC } from "react";

type Props = {
  features: Array<{ name: string; description: string; Icon: FC<any> }>;
};

export default function LandingFeatures({ features }: Props) {
  return (
    <div className="relative bg-slate-50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
        <h2 className="text-base font-semibold tracking-wider text-slate-600 uppercase">
          Private by design
        </h2>
        <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          A better way to collect web analytics
        </p>
        <p className="mt-5 max-w-prose mx-auto text-xl text-slate-500">
          We started this product from our own experience and pain points trying
          to find a holistic and affordable web analytics solution that respects
          people's privacy.
        </p>
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, ...feature }) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-slate-100 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-slate-500 rounded-md shadow-lg">
                        <Icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-slate-900 tracking-tight">
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