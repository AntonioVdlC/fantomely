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

export default function HowItWorksScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="relative bg-slate-50">
      <Header isUserLoggedIn={data.isUserLoggedIn} />

      <main className="mx-auto max-w-7xl px-8">
        <PageHeading>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">How it works</span>
          </h1>
        </PageHeading>

        <div className="prose prose-slate mt-16 max-w-none px-12 md:prose-lg sm:mt-24">
          <p className="text-sm italic">
            For a more in-depth technical explanation, you can read this{" "}
            <a href="https://www.antoniovdlc.me/building-a-privacy-first-web-analytics-platform/">
              blog post
            </a>
            .
          </p>

          <h2>User privacy</h2>
          <p>
            <b>fantomely</b> tracks page views on your web page while preserving
            users' privacy. At its core, it only ever stores cumulative data
            points, so it is impossible to track any data point to a specific
            user.
          </p>
          <p>
            On top of that, it only tracks data provided by the user's browser
            (such as referrers, platform information based on user agent, ...).
          </p>
          <p>
            As all data is cumulative, and <b>fantomely</b> doesn't set any
            cookies or local storage, it is the most private-focused solution
            for tracking usage of your web page while still preserving your
            users' privacy.
          </p>

          <h2>Tracking script</h2>
          <p>
            Events are tracked using a small script that can be added to your
            web pages. The content of the tracking script is public and
            open-source, and it amounts to:
          </p>
          <pre>
            {`!function(){"use strict";window.addEventListener("DOMContentLoaded",(function(){var t=document.querySelector("script[data-fantomely]");if(t){var n="".concat(t.getAttribute("data-h"),"/api/event"),e=t.getAttribute("data-k");if(n&&e&&"undefined"!=typeof window){if(o(),window.history.pushState){var i=window.history.pushState;window.history.pushState=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];o(),i.apply(window.history,t)}}window.onpopstate=function(){o()}}}function o(){fetch(n,{method:"POST",body:JSON.stringify({k:e,p:window.location.href.slice(0,280),r:document.referrer.slice(0,280)})}).catch((function(){return null}))}}))}();`}
          </pre>
          <p>
            The tracking data sent to our servers is also kept to a minimum to
            limit bandwidth usage on your clients.
          </p>

          <h2>Valuable insights</h2>
          <p>
            You can gain useful insights for tracking data while protecting your
            user's privacy!
          </p>
          <p>
            Cumulative timeseries and segmentations by page view, platform
            (browser, operating system), and referrers can give you a useful
            picture of the activity on your web pages.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
