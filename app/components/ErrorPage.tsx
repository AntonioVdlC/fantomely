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
      <div className="min-h-full pt-16 pb-12 flex flex-col bg-slate-50">
        <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex-shrink-0 flex justify-center ${
              status === 404 ? "animate-pulse" : ""
            }`}
          >
            <Logo size="lg" withLink />
          </div>
          <div className="py-16">
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                {status} error
              </p>
              <h1 className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
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
        <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
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
            <Link to="https://twitter.com" className="text-sm font-medium">
              Twitter
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
