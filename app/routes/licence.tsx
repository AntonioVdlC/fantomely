import { getUserId } from "~/utils/session.server";
import { readLicence } from "~/utils/licence.server";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import PageHeading from "~/components/PageHeading";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type LoaderData = {
  isUserLoggedIn: boolean;
  licence: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  const licence = await readLicence();

  return {
    isUserLoggedIn: Boolean(userId),
    licence,
  };
};

export default function LicenceScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="relative bg-slate-50">
      <Header isUserLoggedIn={data.isUserLoggedIn} />

      <main className="mx-auto max-w-7xl px-8">
        <PageHeading>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Licence</span>
          </h1>
        </PageHeading>
        <div
          className="prose prose-slate mt-16 max-w-none px-12 md:prose-lg sm:mt-24"
          dangerouslySetInnerHTML={{ __html: data.licence }}
        ></div>
      </main>

      <Footer />
    </div>
  );
}
