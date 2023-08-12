import { getUserId } from "~/utils/session.server";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import PageHeading from "~/components/PageHeading";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type LoaderData = {
  isUserLoggedIn: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  return {
    isUserLoggedIn: Boolean(userId),
  };
};

export default function AboutScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="relative bg-slate-50">
      <Header isUserLoggedIn={data.isUserLoggedIn} />

      <main className="mx-auto max-w-7xl px-8">
        <PageHeading>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">About</span>
          </h1>
        </PageHeading>

        <div className="prose prose-slate mt-16 max-w-none px-12 md:prose-lg sm:mt-24">
          <p>
            <b>fantomely</b> was created out of the need to find a simple,
            privacy-focused analytics platform for my blog.
          </p>
          <p>
            After scouting the market for a free (or cheap) solution that would
            fit my needs, I failed to find something. Some possible tools I
            looked at include:
          </p>
          <ul>
            <li>
              <a href="https://usefathom.com/">Fathom</a>
            </li>
            <li>
              <a href="https://plausible.io/">Plausible</a>
            </li>
            <li>
              <a href="https://fugu.lol/">Fugu</a>
            </li>
            <li>
              <a href="https://umami.is/">Umami</a>
            </li>
          </ul>
          <p>
            If you are looking for a serious platform for your analytics needs
            that also happens to care about your users' privacy, I would
            recommend checking any of those platforms listed above.
          </p>
          <p>
            I ended up building <b>fantomely</b> because I valued my time to be
            worth less than the ~$10/month that managed versions of Fathom,
            Plausible, and Fugu cost, and instead of self-hosting a third party
            (like Umami or Plausible), why not just self-host my own platform?
          </p>
          <p>
            Currently, <b>fantomely</b> is in private beta, and powers the
            analytics on my <a href="https://antoniovdlc.me">blog</a>, but I
            might monetize it in the future. If you want to play around with it,
            feel free to{" "}
            <a href="https://fantomely.com/auth/waitlist">join the waitlist</a>,
            or look at the{" "}
            <a href="https://github.com/AntonioVdlC/fantomely">source code</a>.
          </p>

          <p>
            <span role="img" aria-label="ghost">
              👻
            </span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
