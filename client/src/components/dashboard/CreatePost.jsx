import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, Smile, MapPin, Send } from "lucide-react";
import { createPost } from "../../features/posts/postSlice";

export default function CreatePost() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const maxLen = 280;

  const handlePost = async () => {
  if (!content.trim()) return;

  await dispatch(
    createPost({
      content,
    })
  );

  setContent("");
};

  const remaining = maxLen - content.length;
  const nearLimit = remaining <= 40;
  const overLimit = remaining < 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <span className="text-sm font-bold text-white uppercase">
            {user?.fullName?.[0] ?? "U"}
          </span>
        </div>

        {/* Composer */}
        <div className="flex-1 flex flex-col gap-3">
          <textarea
            rows={3}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full resize-none bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none leading-relaxed"
          />

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ToolbarBtn icon={Image}   label="Add image" />
              <ToolbarBtn icon={Smile}   label="Add emoji" />
              <ToolbarBtn icon={MapPin}  label="Add location" />
            </div>

            <div className="flex items-center gap-3">
              {/* Character count */}
              {content.length > 0 && (
                <span className={`text-xs font-medium tabular-nums ${overLimit ? "text-red-500" : nearLimit ? "text-amber-500" : "text-slate-400"}`}>
                  {remaining}
                </span>
              )}

              {/* Post button */}
              <button
                onClick={handlePost}
                disabled={!content.trim() || overLimit}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 shadow-sm hover:shadow-md hover:shadow-indigo-200/60 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Send className="w-3.5 h-3.5" strokeWidth={2} />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolbarBtn({ icon: Icon, label }) {
  return (
    <button
      aria-label={label}
      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-150"
    >
      <Icon className="w-4 h-4" strokeWidth={1.75} />
    </button>
  );
}