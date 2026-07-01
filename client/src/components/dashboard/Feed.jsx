import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  toggleLike,
  addComment,
  deletePost,
  updatePost,
} from "../../features/posts/postSlice";
import { useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  Bookmark,
} from "lucide-react";

export default function Feed({ searchQuery = "" }) {
  const { posts, isLoading } = useSelector((state) => state.posts);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPosts = normalizedQuery
    ? posts?.filter((post) => {
        const author = post.author || {};
        return [
          post.content,
          author.fullName,
          author.username,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      })
    : posts;


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

  if (!filteredPosts || filteredPosts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No posts match your search.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {filteredPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const author = post.author || {};
  const isAuthor = user?._id === author._id;

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

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    const result = await dispatch(
      updatePost({
        postId: post._id,
        content: editContent,
      }),
    );

    if (updatePost.fulfilled.match(result)) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            {initials}
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{author.fullName}</h3>

            <p className="text-xs text-slate-400">@{author.username}</p>
          </div>
        </div>

        {isAuthor && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="cursor-pointer text-indigo-600 text-sm hover:text-indigo-800"
            >
              Edit
            </button>

            <button
              onClick={() => {
                if (window.confirm("Delete this post?")) {
                  dispatch(deletePost(post._id));
                }
              }}
              className="cursor-pointer text-red-500 text-sm hover:text-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="mb-5">
          <textarea
            rows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full resize-none border rounded-lg px-3 py-2 text-sm text-slate-700 outline-none leading-relaxed dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />

          <div className="mt-2 flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={!editContent.trim()}
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save
            </button>

            <button
              onClick={handleCancelEdit}
              className="cursor-pointer px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-slate-700 leading-relaxed mb-5 dark:text-slate-200">{post.content}</p>
      )}

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="mb-5 max-h-[520px] w-full rounded-xl object-cover"
        />
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={handleLike}
            className={`cursor-pointer flex items-center gap-1 px-3 py-2 rounded-xl transition ${
              post.likes?.length > 0
                ? "text-red-500 bg-red-50"
                : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
            className="cursor-pointer flex items-center gap-1 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <MessageCircle className="w-4 h-4" />
            {commentCount}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className={`cursor-pointer p-2 rounded-xl ${
              saved
                ? "text-indigo-600 bg-indigo-50"
                : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Comment
            </button>
          </div>

          {post.comments?.length > 0 && (
            <div className="mt-4 space-y-3">
              {post.comments.map((c) => (
                <div key={c._id} className="bg-slate-50 rounded-lg p-3 dark:bg-slate-950">
                  <p className="text-sm font-semibold dark:text-slate-100">{c.user?.fullName}</p>

                  <p className="text-sm text-slate-600 dark:text-slate-300">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
