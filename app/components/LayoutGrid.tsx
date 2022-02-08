import { ReactChild } from "react";

type Props = {
  children: ReactChild | ReactChild[];
};

export default function LayoutGrid({ children }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
      {children}
    </div>
  );
}
