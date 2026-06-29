import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Stories from "../components/dashboard/Stories";
import CreatePost from "../components/dashboard/CreatePost";
import Feed from "../components/dashboard/Feed";
import { TrendingUp, Users, Zap, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPosts } from "../features/posts/postSlice";

const TRENDING = [
  { tag: "design",       posts: "2.4k posts" },
  { tag: "react",        posts: "1.8k posts" },
  { tag: "productivity", posts: "1.2k posts" },
  { tag: "opensource",   posts: "987 posts"  },
  { tag: "ux",           posts: "743 posts"  },
];

const SUGGESTIONS = [
  { name: "Sara Okonkwo",  username: "saraokonkwo",  initials: "SO", from: "from-amber-400",  to: "to-orange-500" },
  { name: "James Liu",     username: "jamesliu",      initials: "JL", from: "from-cyan-400",   to: "to-sky-500"    },
  { name: "Nia Roberts",   username: "niaroberts",    initials: "NR", from: "from-fuchsia-400",to: "to-pink-500"   },
];

export default function Dashboard() {
  const dispatch = useDispatch();

useEffect(() => {
  dispatch(getPosts());
}, [dispatch]);
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* Center — main feed */}
          <div className="flex flex-col gap-4 min-w-0">
            <Stories />
            <CreatePost />
            <Feed />
          </div>

          {/* Right panel */}
          <aside className="hidden lg:flex flex-col gap-4">

            {/* Trending */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-indigo-500" strokeWidth={2} />
                <h3 className="text-sm font-bold text-slate-800">Trending</h3>
              </div>
              <ul className="space-y-0.5">
                {TRENDING.map((t, i) => (
                  <li key={t.tag}>
                    <button className="w-full flex items-center justify-between px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors group text-left">
                      <div>
                        <span className="text-xs text-slate-400 font-medium">#{i + 1}</span>
                        <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                          #{t.tag}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">{t.posts}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who to follow */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-indigo-500" strokeWidth={2} />
                <h3 className="text-sm font-bold text-slate-800">Who to follow</h3>
              </div>
              <ul className="space-y-1">
                {SUGGESTIONS.map((s) => (
                  <SuggestionItem key={s.username} {...s} />
                ))}
              </ul>
            </div>

            {/* Stats card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200/50">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-indigo-200" strokeWidth={2} />
                <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wide">Your activity</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Posts",     value: "24"  },
                  { label: "Followers", value: "138" },
                  { label: "Following", value: "97"  },
                  { label: "Saves",     value: "41"  },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 rounded-xl px-3 py-2.5">
                    <p className="text-lg font-black leading-none">{stat.value}</p>
                    <p className="text-xs text-indigo-200 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SuggestionItem({ name, username, initials, from, to }) {
  const [following, setFollowing] = useState(false);
  return (
    <li className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors">
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${from} ${to} flex items-center justify-center shrink-0 shadow-sm`}>
        <span className="text-xs font-bold text-white">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{name}</p>
        <p className="text-xs text-slate-400 truncate">@{username}</p>
      </div>
      <button
        onClick={() => setFollowing((v) => !v)}
        className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all duration-150
          ${following
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          }`}
      >
        {!following && <UserPlus className="w-3 h-3" strokeWidth={2} />}
        {following ? "Following" : "Follow"}
      </button>
    </li>
  );
}

