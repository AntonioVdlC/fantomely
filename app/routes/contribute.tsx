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

      <div className="relative bg-slate-50 overflow-hidden">
        <div
          className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full"
          aria-hidden="true"
        >
          <div className="relative h-full max-w-7xl mx-auto">
            <svg
              className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
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
                height={784}
                fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
              />
            </svg>
            <svg
              className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
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
                height={784}
                fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"
              />
            </svg>
          </div>
        </div>

        <div className="relative pt-6 pb-16 sm:pb-24">
          <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Contribute</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                The platform is open source, and very welcoming of
                contributions!
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div>
                  <Button to="https://github.com" external primary>
                    Contribute
                  </Button>
                </div>
              </div>

              <hr className="mt-8 md:mt-12 max-w-md mx-auto " />

              <p className="mt-8 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-12 md:text-xl md:max-w-3xl">
                As we are currently in private beta, you can also contribute by
                joining the waitlist and testing the platform.
              </p>
              <div className="mt-3 text-center flex flex-col items-center">
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
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
