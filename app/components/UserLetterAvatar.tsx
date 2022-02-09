import { User } from "@prisma/client";
import classNames from "~/utils/class-names";

export function generateAvatarColor(user: User | undefined) {
  const name = user?.firstName?.concat?.(user?.lastName || "") || "";

  if (!name) {
    return "bg-slate-600";
  }

  const colors = [
    "bg-slate-600",
    "bg-slate-600",
    "bg-zinc-600",
    "bg-stone-600",
    "bg-red-600",
    "bg-orange-600",
    "bg-amber-600",
    "bg-yellow-600",
    "bg-lime-600",
    "bg-green-600",
    "bg-emerald-600",
    "bg-teal-600",
    "bg-cyan-600",
    "bg-sky-600",
    "bg-blue-600",
    "bg-indigo-600",
    "bg-violet-600",
    "bg-purple-600",
    "bg-fuschia-600",
    "bg-pink-600",
    "bg-rose-600",
  ];

  // We select an index based on the name of the website
  const colorIndex =
    name
      .toLowerCase()
      .split("")
      .filter((l) => l.charCodeAt(0) > 96)
      .map((l) => l.charCodeAt(0) - 96)
      .reduce((sum, val) => sum + val, 0) % colors.length;

  return colors[colorIndex];
}

type Props = {
  user: User;
};

export default function UserLetterAvatar({ user }: Props) {
  return (
    <span
      className={classNames(
        generateAvatarColor(user),
        "inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-500"
      )}
    >
      <span className="text-sm font-medium leading-none text-white">
        {user?.firstName?.[0]}
        {user?.lastName?.[0]}
      </span>
    </span>
  );
}
