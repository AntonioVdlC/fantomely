import { Link, MetaFunction } from "remix";
import { Links, LiveReload, Outlet, Meta, Scripts } from "remix";
import { useCatch } from "remix";

import errors, { defaultError } from "~/utils/errors";

import styles from "./tailwind.css";
import favicon from "./assets/favicon.png";
import Logo from "./components/Logo";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "icon", type: "image/png", href: favicon },
  ];
}

export const meta: MetaFunction = () => {
  const description = `Privacy-First Web Analytics`;
  return {
    description,
    keywords: "privacy, web analytics, analytics",
    "og:title": "Fantomely",
    "og:description": "Privacy-First Web Analytics",
  };
};

function Document({
  children,
  title = `Fantomely | Privacy-First Web Analytics`,
  full = false,
}: {
  children: React.ReactNode;
  title?: string;
  full?: boolean;
}) {
  return (
    <html lang="en" className={full ? "h-full" : ""}>
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className={full ? "h-full" : ""}>
        {children}
        <Scripts />
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const error = errors[caught.status.toString()] || defaultError;

  return (
    <Document title={`${caught.status} ${caught.statusText}`} full>
      <>
        <div className="min-h-full pt-16 pb-12 flex flex-col bg-slate-50">
          <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex-shrink-0 flex justify-center">
              <Logo size="lg" />
            </div>
            <div className="py-16">
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  {caught.status} error
                </p>
                <h1 className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
                  {error.title}
                </h1>
                <p className="mt-2 text-base text-slate-500">
                  {error.description}
                </p>
                <div className="mt-6">
                  <Link to="/" className="text-base font-medium">
                    Go back home<span aria-hidden="true"> &rarr;</span>
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
              <Link to="/status" className="text-sm font-medium">
                Status
              </Link>
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
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error">
      <div>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
