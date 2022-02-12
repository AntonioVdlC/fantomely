import { Link } from "remix";

import type { ButtonHTMLAttributes, HTMLAttributes, ReactChild } from "react";

type Props = {
  children: ReactChild | ReactChild[];
  primary?: boolean;
  secondary?: boolean;
  external?: boolean;
  to?: string;
};

export default function Button({
  children,
  primary = false,
  secondary = false,
  external = false,
  to,
  ...props
}: Props &
  HTMLAttributes<HTMLElement> &
  ButtonHTMLAttributes<HTMLButtonElement>) {
  let color;
  if (primary) {
    color =
      "bg-slate-600 text-white font-medium hover:bg-slate-700 focus:ring-slate-800";
  }
  if (secondary) {
    color =
      "bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 focus:ring-slate-300";
  }

  const className = `block text-center whitespace-nowrap w-full py-3 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-inset ${color}`;

  return to ? (
    external ? (
      <a
        {...props}
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    ) : (
      <Link {...props} to={to} className={className}>
        {children}
      </Link>
    )
  ) : (
    <button {...props} className={className}>
      {children}
    </button>
  );
}
