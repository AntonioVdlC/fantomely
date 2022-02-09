import { Link } from "remix";
import Button from "~/components/Button";

import illustration from "~/assets/illustration_landing.svg";

export default function LandingHero() {
  return (
    <div className="pt-10 bg-slate-50 sm:pt-16 lg:pt-8 lg:overflow-hidden">
      <div className="mx-auto max-w-7xl px-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center lg:col-span-3">
            <div className="lg:py-24">
              <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-slate-900 sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                <span className="block">Make your analytics</span>
                <span className="block text-slate-500">private and secure</span>
              </h1>
              <p className="mt-3 text-base text-slate-700 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Get actionable insights about your website usage without
                vulnerating your users' privacy by storing only aggregated data
                on an open-source platform.
              </p>
              <div className="mt-10 sm:mt-12">
                <form
                  method="post"
                  action="/auth/waitlist"
                  className="sm:max-w-xl sm:mx-auto lg:mx-0"
                >
                  <div className="sm:flex">
                    <div className="min-w-0 flex-1">
                      <label htmlFor="email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="Enter your email"
                        className="block w-full px-4 py-3 rounded-md text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 focus:ring-offset-slate-900  border border-slate-300"
                      />
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Button primary type="submit">
                        Join the wailist
                      </Button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-500 sm:mt-4">
                    Join our waitlist and get an invite when we launch our
                    private beta. By providing your email, you agree to our{" "}
                    <Link to="/terms" className="font-medium text-slate-900">
                      terms of service
                    </Link>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:m-0 lg:relative">
            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
              <img
                className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                src={illustration}
                alt="Woman standing with an umbrella, protecting herself from satellites"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
