import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleLike, addComment } from "../../features/posts/postSlice";
import { useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  MoreHorizontal,
  Bookmark,
} from "lucide-react";

export default function Feed() {
  const { posts, isLoading } = useSelector((state) => state.posts);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        Loading posts...
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-500">
        No posts yet. Create the first post 🚀
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }) {
  const dispatch = useDispatch();
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  const author = post.author || {};

  const initials =
    author.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;
  const handleLike = () => {
    dispatch(toggleLike(post._id));
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            {initials}
          </div>

          <div>
            <h3 className="font-semibold text-slate-800">{author.fullName}</h3>

            <p className="text-xs text-slate-400">@{author.username}</p>
          </div>
        </div>

        <button>
          <MoreHorizontal className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Content */}
      <p className="text-slate-700 leading-relaxed mb-5">{post.content}</p>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl transition ${
              post.likes?.length > 0
                ? "text-red-500 bg-red-50"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Heart
              className="w-4 h-4"
              fill={post.likes?.length > 0 ? "currentColor" : "none"}
            />
            {likeCount}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
          >
            <MessageCircle className="w-4 h-4" />
            {commentCount}
          </button>

          <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100">
            <Repeat2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <button className="p-2 rounded-xl hover:bg-slate-100">
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSaved(!saved)}
            className={`p-2 rounded-xl ${
              saved
                ? "text-indigo-600 bg-indigo-50"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Bookmark
              className="w-4 h-4"
              fill={saved ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      {showComments && (
        <div className="mt-4 border-t pt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
            />

            <button
              onClick={() => {
                if (!comment.trim()) return;

                dispatch(
                  addComment({
                    postId: post._id,
                    text: comment,
                  }),
                );

                setComment("");
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Comment
            </button>
          </div>

          {post.comments?.length > 0 && (
            <div className="mt-4 space-y-3">
              {post.comments.map((c) => (
                <div key={c._id} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm font-semibold">{c.user?.fullName}</p>

                  <p className="text-sm text-slate-600">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
