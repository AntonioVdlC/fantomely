export function generateWebsiteInitials(name: string | null) {
  if (!name) {
    return "A";
  }

  const parts = name.replace(/http(s)?:\/\//, "").split(".");
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  } else {
    return parts.slice(-2, -1)[0][0].toUpperCase();
  }
}

export function generateWebsiteColor(name: string | null) {
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
