import { Link } from "@remix-run/react";
import Button from "~/components/Button";

export default function LandingCTA() {
  return (
    <div className="relative sm:py-16">
      <div aria-hidden="true" className="hidden sm:block">
        <div className="absolute inset-y-0 left-0 w-1/2 rounded-r-3xl bg-slate-100" />
        <svg
          className="absolute left-1/2 top-8 -ml-3"
          width={404}
          height={392}
          fill="none"
          viewBox="0 0 404 392"
        >
          <defs>
            <pattern
              id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={4}
                height={4}
                className="text-slate-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={392}
            fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)"
          />
        </svg>
      </div>
      <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-slate-500 px-6 py-10 shadow-xl sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
          >
            <svg
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 1463 360"
            >
              <path
                className="text-slate-400 text-opacity-40"
                fill="currentColor"
                d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
              />
              <path
                className="text-slate-600 text-opacity-40"
                fill="currentColor"
                d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
              />
            </svg>
          </div>
          <div className="relative">
            <div className="sm:text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Get notified when we're launching.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-100">
                Join our waitlist and get an invite when we launch our private
                beta. By providing your email, you agree to our{" "}
                <Link
                  to="/terms"
                  className="font-medium text-slate-200 hover:text-slate-300"
                >
                  terms of service
                </Link>
                .
              </p>
            </div>
            <form
              method="post"
              action="/auth/waitlist"
              className="mt-12 sm:mx-auto sm:flex sm:max-w-lg"
            >
              <div className="min-w-0 flex-1">
                <label htmlFor="cta-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="cta-email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border-0 px-4 py-3 text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-slate-900"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mt-4 sm:ml-3 sm:mt-0">
                <Button primary type="submit">
                  Join the wailist
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
