import { Link, LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import Button from "~/components/Button";

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
      <div className="relative bg-slate-600">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:text-center sm:px-16">
            <p className="font-medium text-slate-50">
              <span className="md:hidden">
                We are currently in private beta!
              </span>
              <span className="hidden md:inline">
                We are currently in private beta, and looking for beta users!
              </span>
              <span className="block sm:ml-2 sm:inline-block">
                <Link
                  to="/auth/waitlist"
                  className="text-slate-50 font-bold underline"
                >
                  {" "}
                  Join the waitlist <span aria-hidden="true">&rarr;</span>
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              WIP
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              Pricing
            </h1>
            <p className="mt-2 sm:max-w-xl sm:mx-auto text-base text-slate-500">
              We are currently in private beta and haven't totally figured out
              the pricing model. There will most likely be a free tier though,
              so you can join the waitlist below and maybe have access to the
              free private beta!
            </p>
            <div className="mt-12 text-center flex flex-col items-center">
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
                  Join our waitlist and get an invite when we launch our private
                  beta. By providing your email, you agree to our{" "}
                  <Link to="/terms" className="font-medium text-slate-900">
                    terms of service
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
