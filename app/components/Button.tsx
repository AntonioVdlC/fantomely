import type { ButtonHTMLAttributes, HTMLAttributes, ReactChild } from "react";
import { Link } from "remix";

type Props = {
  children: ReactChild | ReactChild[];
  primary?: boolean;
  secondary?: boolean;
  to?: string;
};

export default function Button({
  children,
  primary = false,
  secondary = false,
  to,
  ...props
}: Props &
  HTMLAttributes<HTMLElement> &
  ButtonHTMLAttributes<HTMLButtonElement>) {
  let color;
  if (primary) {
    color = "bg-slate-600 text-white font-medium hover:bg-slate-700";
  }
  if (secondary) {
    color = "bg-slate-100 text-slate-800 font-medium hover:bg-slate-200";
  }

  const className = `block text-center whitespace-nowrap w-full py-3 px-4 rounded-md shadow ${color}`;

  return to ? (
    <Link {...props} to={to} className={className}>
      {children}
    </Link>
  ) : (
    <button {...props} className={className}>
      {children}
    </button>
  );
}
