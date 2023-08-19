import { getUserId } from "~/utils/session.server";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageHeading from "~/components/PageHeading";

import imgAddWebsite from "~/assets/docs/add-website.png";
import imgDeleteWebsite from "~/assets/docs/delete-website.png";
import imgWebsiteDetails from "~/assets/docs/website-details.png";
import imgWebsiteSettings from "~/assets/docs/website-settings.png";
import imgExistingWebsites from "~/assets/docs/existing-websites.png";
import imgDashboardOverview from "~/assets/docs/dashboard-overview.png";
import imgDashboardDetails from "~/assets/docs/dashboard-details.png";

type LoaderData = {
  isUserLoggedIn: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  return {
    isUserLoggedIn: Boolean(userId),
  };
};

export default function DocsScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="relative bg-slate-50">
      <Header isUserLoggedIn={data.isUserLoggedIn} />

      <main className="mx-auto max-w-7xl px-8">
        <PageHeading>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Docs</span>
          </h1>
        </PageHeading>

        <div className="prose prose-slate mt-16 max-w-none px-12 md:prose-lg sm:mt-24">
          <h3 className="text-bold" id="how-it-works">
            <a
              href="#how-it-works"
              className="text-slate-900 no-underline hover:text-slate-600"
            >
              #
            </a>{" "}
            How it works
          </h3>
          <p>
            To get a high-level overview of how <code>fantomely</code> tracks
            analytics on your website while preserving your users' privacy,
            please check <a href="/how">How it works</a>.
          </p>
          {!data.isUserLoggedIn ? (
            <>
              <h3 className="text-bold" id="getting-started">
                <a
                  href="#getting-started"
                  className="text-slate-900 no-underline hover:text-slate-600"
                >
                  #
                </a>{" "}
                Getting started
              </h3>

              <p>
                To get started, make sur you have{" "}
                <a href="/auth/register">created an account</a>. If you already
                have an account, you can <a href="/auth/login">sign in here</a>!
              </p>
              <p>Once you're logged in, you can continue with the guide.</p>
            </>
          ) : null}
          <h3 className="text-bold" id="track-website">
            <a
              href="#track-website"
              className="text-slate-900 no-underline hover:text-slate-600"
            >
              #
            </a>{" "}
            Track your website
          </h3>
          <h4 id="add-website">
            <a
              href="#add-website"
              className="text-slate-900 no-underline hover:text-slate-600"
            >
              ##
            </a>{" "}
            Add a website
          </h4>
          <p>
            To track your website, first create it in the{" "}
            <a href="/app/websites">Websites</a> tab by providing a name and
            URL.
          </p>
          <img src={imgAddWebsite} alt="Add a new website to track" />
          <h4 id="install-tracking-script">
            <a
              href="#install-tracking-script"
              className="text-slate-900 no-underline hover:text-slate-600"
            >
              ##
            </a>{" "}
            Install tracking script
          </h4>
          <p>
            Once a new website is correctly created, you are presented with the
            website details. This screen provides the necessary information to
            install the tracking script to your website and start tracking page
            views and related data.
          </p>
          <img src={imgWebsiteDetails} alt="Website details" />
          The exact steps to add the tracking script to your website will vary
          depending on how you're hosting your website. Ideally you should copy
          and paste the script just before the closing <code>
            {"</head>"}
          </code>{" "}
          tag inside your <code>index.html</code>.
          <h4 id="website-settings">
            <a
              href="#website-settings"
              className="text-slate-900 no-underline hover:text-slate-600"
            >
              ##
            </a>{" "}
            Website settings
          </h4>
          <p>
            In the website details screen, you can also change some of your
            website tracking settings:
          </p>
          <img src={imgWebsiteSettings} alt="Website settings" />
          <h4 id="website-overview">
            <a
              href="#website-overview"
              className="text-slate-900 no-underline hover:text-slate-600"
            >
              ##
            </a>{" "}
            Websites overview
          </h4>
          <p>
            You can have an overview of your websites in the{" "}
            <a href="/app/websites">Websites</a> tab.
          </p>
          <img src={imgExistingWebsites} alt="Existing websites" />
          <h4 id="delete-website">
            <a
              href="#delete-website"
              className="text-slate-900 no-underline hover:text-slate-600"
            >
              ##
            </a>{" "}
            Delete a website
          </h4>
          <p>
            You can delete a website at any point by clicking on the ... icon
            and selecting <code>Delete</code>:
          </p>
          <img src={imgDeleteWebsite} alt="Delete website" />
          <h3 className="text-bold" id="dashboards">
            <a
              href="#dashboards"
              className="text-slate-900 no-underline hover:text-slate-600"
            >
              #
            </a>{" "}
            Dashboards
          </h3>
          <p>
            Dashboards are the main way to visualize your data. They can be
            accessed via the <a href="/app/dashboard">Dashboard</a> tab.
          </p>
          <h4 id="dashboards-overview">
            <a
              href="#dashboards-overview"
              className="text-slate-900 no-underline hover:text-slate-600"
            >
              ##
            </a>{" "}
            Dashboards overview
          </h4>
          <p>
            Here, you can see an overview of the page views on your website over
            the past hour, past day, and past month. You can also see
            comparative indicators with the previous hour, previous day, or
            previous month respectively.
          </p>
          <img src={imgDashboardOverview} alt="Dashboard overview" />
          <h4 id="dashboard-details">
            <a
              href="#dashboard-details"
              className="text-slate-900 no-underline hover:text-slate-600"
            >
              ##
            </a>{" "}
            Dashboard details
          </h4>
          <p>
            Clicking on <code>View Details</code> brings you to charts
            displaying the number of page views per day, as well as a drill down
            per paths, referrers, browsers, and platforms.
          </p>
          <img src={imgDashboardDetails} alt="Dashboard details" />
          <p className="border-l-2 border-l-slate-500 bg-slate-200 p-2 pl-4 italic">
            Note: More dashboards and ways to explore your data are coming soon!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
