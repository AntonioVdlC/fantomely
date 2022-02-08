import {
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  MinusSmIcon,
} from "@heroicons/react/outline";
import { Link } from "remix";
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
    <div className="relative bg-white pt-4 px-4 pb-14 shadow rounded-lg overflow-hidden flex">
      <div
        className={classNames(
          generateWebsiteColor(item.name),
          "flex-shrink-0 flex items-center justify-center w-16 text-white text-2xl font-medium rounded-md shadow-sm"
        )}
      >
        {generateWebsiteInitials(item.name)}
      </div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <dt>
          <p className="ml-4 text-sm font-medium text-slate-500 truncate">
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
              "inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0"
            )}
          >
            {item.stats.change > 0 ? (
              <ArrowSmUpIcon
                className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
                aria-hidden="true"
              />
            ) : item.stats.change < 0 ? (
              <ArrowSmDownIcon
                className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            ) : (
              <MinusSmIcon
                className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-slate-500"
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
          <div className="absolute bottom-0 inset-x-0 bg-slate-50 px-4 py-3">
            <div className="text-sm">
              <Link
                to={`/app/dashboard/${item.id}`}
                className="font-medium text-slate-600 hover:text-slate-500 block"
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
