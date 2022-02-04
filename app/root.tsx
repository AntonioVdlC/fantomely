import type { MetaFunction } from "remix";
import { Links, LiveReload, Outlet, Meta, Scripts } from "remix";
import { useCatch } from "remix";

import errors, { defaultError } from "~/utils/errors";

import styles from "./tailwind.css";
import favicon from "~/assets/favicon.png";
import ErrorPage from "~/components/ErrorPage";

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
    "og:description": description,
  };
};

function Document({
  children,
  title = `Fantomely | Privacy-First Web Analytics`,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className="h-full">
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
    <Document title={`${caught.status} ${caught.statusText}`}>
      <ErrorPage status={caught.status} {...error} />
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
