import { Link, useLoaderData } from "remix";

import type { LoaderFunction } from "remix";

import { getUserId } from "~/utils/session.server";

import Button from "~/components/Button";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import PageHeading from "~/components/PageHeading";

type LoaderData = {
  isUserLoggedIn: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  return {
    isUserLoggedIn: Boolean(userId),
  };
};

export default function ContributeScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="relative bg-slate-50">
      <Header isUserLoggedIn={data.isUserLoggedIn} />

      <main>
        <PageHeading>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Contribute</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-slate-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            The platform is open source, and very welcoming of contributions!
          </p>
          <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
            <div>
              <Button
                to="https://github.com/AntonioVdlC/analytics-service"
                external
                primary
              >
                Contribute
              </Button>
            </div>
          </div>

          <hr className="mx-auto mt-8 max-w-md md:mt-12 " />

          <p className="mx-auto mt-8 max-w-md text-base text-slate-500 sm:text-lg md:mt-12 md:max-w-3xl md:text-xl">
            As we are currently in private beta, you can also contribute by
            joining the waitlist and testing the platform.
          </p>
          <div className="mt-3 flex flex-col items-center text-center">
            <form
              method="post"
              action="/auth/waitlist"
              className="sm:mx-auto sm:max-w-xl lg:mx-0"
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
                    className="block w-full rounded-md border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300  focus:ring-offset-2 focus:ring-offset-slate-900"
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
        </PageHeading>
      </main>

      <Footer />
    </div>
  );
}
