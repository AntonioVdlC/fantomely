import type { MetaFunction } from "remix";
import { Links, LiveReload, Outlet, Meta, Scripts } from "remix";
import { useCatch } from "remix";

export const meta: MetaFunction = () => {
  const description = `Analytics Service`;
  return {
    description,
    keywords: "analytics",
    // "twitter:image": "https://remix-jokes.lol/social.png",
    // "twitter:card": "summary_large_image",
    // "twitter:creator": "@remix_run",
    // "twitter:site": "@remix_run",
    // "twitter:title": "Remix Jokes",
    // "twitter:description": description,
  };
};

function Document({
  children,
  title = `Analytics Service`,
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
