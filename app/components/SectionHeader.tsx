import { ReactChild } from "react";

type Props = {
  children: ReactChild | ReactChild[];
};

export default function SectionHeader({ children }: Props) {
  return (
    <h2 className="text-slate-500 text-xs font-medium uppercase tracking-wide">
      {children}
    </h2>
  );
}
