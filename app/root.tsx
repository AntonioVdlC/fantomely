import type { MetaFunction } from "remix";
import { Links, LiveReload, Outlet, Meta, Scripts } from "remix";
import { useCatch } from "remix";

import styles from "./tailwind.css";
import favicon from "./assets/favicon.png";

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
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
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

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
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
