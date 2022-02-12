import type { ReactChild } from "react";

type Props = {
  children: ReactChild | ReactChild[];
};

export default function SectionHeader({ children }: Props) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">
      {children}
    </h2>
  );
}
