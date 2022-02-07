import { ChevronRightIcon } from "@heroicons/react/outline";
import { HomeIcon } from "@heroicons/react/solid";
import { Website } from "@prisma/client";
import { useState, useEffect } from "react";
import { Link, useLocation } from "remix";

// https://stackoverflow.com/a/38191078
function isUUID(str: string) {
  return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
    str
  );
}

type CrumbItem = {
  name: string;
  href: string;
  current: boolean;
};

type Props = {
  websites: Website[];
};

export default function Breadcrumbs({ websites }: Props) {
  const [crumbs, setCrumbs] = useState<CrumbItem[]>([]);

  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    setCrumbs(pathToCrumbs(path));
  }, [path]);

  function pathToCrumbs(pathname: string) {
    const parts = pathname.replace("/app", "").split("/").filter(Boolean);
    const crumbs = [];

    let globalPath = "/app/";
    for (let i = 0, length = parts.length; i < length; i++) {
      const part = parts[i];
      globalPath += part + "/";

      let name = part;
      if (isUUID(part)) {
        if (
          globalPath.includes("websites") ||
          globalPath.includes("dashboard")
        ) {
          name = websites.find((website) => website.id === part)?.name || part;
        }
      }
      const crumb = { name, href: globalPath };

      crumbs.push({ ...crumb, current: i === parts.length - 1 });
    }

    return crumbs;
  }

  return crumbs.length ? (
    <nav className="hidden sm:flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link to="/app" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {crumbs.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <Link
                to={page.href}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 uppercase"
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  ) : null;
}
