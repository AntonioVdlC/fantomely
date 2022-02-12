import { Link } from "remix";

import Logo from "~/components/Logo";

type Props = {
  status: number;
  title: string;
  description: string;
  goToLink?: {
    text: string;
    href: string;
  };
};

export default function ErrorPage({
  status,
  title,
  description,
  goToLink = { text: "Go back home", href: "/" },
}: Props) {
  return (
    <>
      <div className="flex min-h-full flex-col bg-slate-50 pt-16 pb-12">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-shrink-0 justify-center ${
              status === 404 ? "animate-pulse" : ""
            }`}
          >
            <Logo size="lg" withLink />
          </div>
          <div className="py-16">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                {status} error
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {title}
              </h1>
              <p className="mt-2 text-base text-slate-500">{description}</p>
              <div className="mt-6">
                <Link to={goToLink.href} className="text-base font-medium">
                  {goToLink.text}
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <footer className="mx-auto w-full max-w-7xl flex-shrink-0 px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-4">
            <a
              href="mailto:support@fantomely.com"
              className="text-sm font-medium"
            >
              Contact Support
            </a>
            <span
              className="inline-block border-l border-slate-300"
              aria-hidden="true"
            />
            <Link
              to="https://twitter.com/fantome_ly"
              className="text-sm font-medium"
            >
              Twitter
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
