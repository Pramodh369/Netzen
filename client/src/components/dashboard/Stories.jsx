import { Plus } from "lucide-react";

const STORIES = [
  { id: 1, name: "Alex K.",    initials: "AK", from: "from-pink-400",    to: "to-rose-500",    ring: "ring-pink-300" },
  { id: 2, name: "Maria S.",   initials: "MS", from: "from-amber-400",   to: "to-orange-500",  ring: "ring-amber-300" },
  { id: 3, name: "Dev P.",     initials: "DP", from: "from-emerald-400", to: "to-teal-500",    ring: "ring-emerald-300" },
  { id: 4, name: "Yuki T.",    initials: "YT", from: "from-blue-400",    to: "to-indigo-500",  ring: "ring-blue-300" },
  { id: 5, name: "Priya N.",   initials: "PN", from: "from-violet-400",  to: "to-purple-500",  ring: "ring-violet-300" },
  { id: 6, name: "Carlos M.",  initials: "CM", from: "from-cyan-400",    to: "to-sky-500",     ring: "ring-cyan-300" },
];

export default function Stories() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-1">

        {/* Add story */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-indigo-300 flex items-center justify-center bg-indigo-50 group-hover:border-indigo-500 group-hover:bg-indigo-100 transition-all">
            <Plus className="w-5 h-5 text-indigo-500" strokeWidth={2} />
          </div>
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Add story</span>
        </div>

        {/* Story items */}
        {STORIES.map((s) => (
          <StoryItem key={s.id} {...s} />
        ))}
      </div>
    </div>
  );
}

function StoryItem({ name, initials, from, to, ring }) {
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${from} ${to} flex items-center justify-center ring-2 ring-offset-2 ${ring} group-hover:scale-105 transition-transform duration-150 shadow-sm`}>
        <span className="text-sm font-bold text-white">{initials}</span>
      </div>
      <span className="text-xs text-slate-500 font-medium whitespace-nowrap max-w-[56px] truncate text-center">
        {name}
      </span>
    </div>
  );
}