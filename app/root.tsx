import {
  Links,
  LiveReload,
  Outlet,
  Meta,
  Scripts,
  redirect,
  useCatch,
} from "remix";

import type { LoaderFunction, MetaFunction } from "remix";

import errors, { defaultError } from "~/utils/errors";

import ErrorPage from "~/components/ErrorPage";

import styles from "./tailwind.css";

import favicon from "~/assets/favicon.png";

export const loader: LoaderFunction = ({ request }) => {
  // upgrade people to https automatically
  // https://github.com/remix-run/remix-jokes/blob/8f786d9d7fa7ea62203e87c1e0bdaa9bda3b28af/app/root.tsx#L25-L46

  const url = new URL(request.url);
  const hostname = url.hostname;
  const proto = request.headers.get("X-Forwarded-Proto") ?? url.protocol;

  url.host =
    request.headers.get("X-Forwarded-Host") ??
    request.headers.get("host") ??
    url.host;
  url.protocol = "https:";

  if (proto === "http" && hostname !== "localhost") {
    return redirect(url.toString(), {
      headers: {
        "X-Forwarded-Proto": "https",
      },
    });
  }
  return {};
};

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
    "og:title": "fantomely",
    "og:description": description,
  };
};

function Document({
  children,
  title = `fantomely | Privacy-First Web Analytics`,
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
        {/* fantomely on fantomely */}
        {process.env.NODE_ENV === "production" ? (
          <script
            defer
            src="https://fantomely.com/sdk/browser.js"
            data-fantomely
            data-h="https://fantomely.com"
            data-k="c3d877bf99ed0e0e3df4cea98e1273a38966b7c6dc53b670051250bcfc88016c"
          ></script>
        ) : null}
      </head>
      <body className="h-full text-slate-900">
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
