import {
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  MinusSmIcon,
} from "@heroicons/react/outline";
import { Link } from "@remix-run/react";

import classNames from "~/utils/class-names";
import { generateWebsiteColor, generateWebsiteInitials } from "~/utils/website";

type Stats = {
  value: {
    current: number;
    previous: number;
  };
  change: number;
};

type Item = {
  id: string;
  name: string;
  stats: Stats;
};

type Props = {
  item: Item;
};

export default function DashboardItem({ item }: Props) {
  return (
    <div className="relative flex overflow-hidden rounded-lg bg-white px-4 pb-14 pt-4 shadow">
      <div
        className={classNames(
          generateWebsiteColor(item.name),
          "flex w-16 flex-shrink-0 items-center justify-center rounded-md text-2xl font-medium text-white shadow-sm"
        )}
      >
        {generateWebsiteInitials(item.name)}
      </div>
      <div className="flex flex-1 flex-col justify-between py-1">
        <dt>
          <p className="ml-4 truncate text-sm font-medium text-slate-500">
            {item.name}
          </p>
        </dt>
        <dd className="ml-4 flex items-center justify-between">
          <p className="text-2xl font-semibold text-slate-900">
            {item.stats.value.current}
          </p>
          <div
            className={classNames(
              item.stats.change > 0
                ? "bg-green-100 text-green-800"
                : item.stats.change < 0
                ? "bg-red-100 text-red-800"
                : "bg-slate-100 text-slate-800",
              "inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0"
            )}
          >
            {item.stats.change > 0 ? (
              <ArrowSmUpIcon
                className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                aria-hidden="true"
              />
            ) : item.stats.change < 0 ? (
              <ArrowSmDownIcon
                className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                aria-hidden="true"
              />
            ) : (
              <MinusSmIcon
                className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-slate-500"
                aria-hidden="true"
              />
            )}

            <span className="sr-only">
              {item.stats.change > 0
                ? "Increased"
                : item.stats.change < 0
                ? "Decreased"
                : "Stayed same"}{" "}
              by
            </span>
            {Math.abs(item.stats.change)}
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-slate-50 px-4 py-3">
            <div className="text-sm">
              <Link
                to={`/app/dashboard/${item.id}`}
                className="block font-medium text-slate-600 hover:text-slate-500"
              >
                {" "}
                View details
                <span className="sr-only"> {item.name} stats</span>
              </Link>
            </div>
          </div>
        </dd>
      </div>
    </div>
  );
}
