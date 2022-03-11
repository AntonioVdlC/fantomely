import { useLoaderData } from "remix";

import type { LoaderFunction } from "remix";

import { getUserId } from "~/utils/session.server";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { marked } from "marked";
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

export default function AboutScreen() {
  const data = useLoaderData<LoaderData>();
  const content = marked(`
\`fantomely\` was created out of the need to find a simple, privacy-focused analytics platform for my blog.

After scouting the market for a free (or cheap) solution that would fit my needs, I failed to find something. Some possible tools I looked at include:
- [Fathom](https://usefathom.com/) 
- [Plausible](https://plausible.io/)
- [Fugu](https://fugu.lol/)
- [Umami](https://umami.is/)

If you are looking for a serious platform for your analytics needs that also happens to care about your users' privacy, I would recommend checking any of those platforms listed above.

I ended up building \`fantomely\` because I valued my time to be worth less than the ~$10/month that managed versions of Fathom, Plausible, and Fugu cost, and instead of self-hosting a third party (like Umami or Plausible), why not just self-host my own platform?

Currently, \`fantomely\` is in private beta, and powers the analytics on my [blog](https://antoniovdlc.me), but I might monetize it in the future. If you want to play around with it, feel free to [join the waitlist](https://fantomely.com/auth/waitlist), or look at the [source code](https://github.com/AntonioVdlC/fantomely).

👻
  `);

  return (
    <div className="relative bg-slate-50">
      <Header isUserLoggedIn={data.isUserLoggedIn} />

      <main>
        <PageHeading>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">About</span>
          </h1>
        </PageHeading>

        <div
          className="prose prose-slate mt-16 max-w-none px-12 sm:mt-24 md:prose-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </main>

      <Footer />
    </div>
  );
}
