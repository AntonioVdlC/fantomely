import DashboardItem from "~/components/DashboardItem";
import LayoutGrid from "~/components/LayoutGrid";
import H2 from "~/components/SectionHeader";

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
  title: string;
  items: Item[];
};

export default function DashboardSection({ title, items }: Props) {
  return (
    <div>
      <H2>{title}</H2>
      <dl className="mt-3">
        <LayoutGrid>
          {items.map((item) => (
            <DashboardItem key={item.id} item={item} />
          ))}
        </LayoutGrid>
      </dl>
    </div>
  );
}
