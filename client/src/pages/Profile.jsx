import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Camera, Image, Save, UserPlus, UserMinus } from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
  followUser,
  getProfile,
  getUserProfile,
  unfollowUser,
  updateProfile,
} from "../features/auth/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const { username } = useParams();
  const {
    user,
    profileUser,
    profilePosts,
    isFollowingProfile,
    loading,
  } = useSelector((state) => state.auth);
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      bio: "",
    },
  });

  useEffect(() => {
    if (username && username !== user?.username) {
      dispatch(getUserProfile(username));
    } else {
      dispatch(getProfile());
    }
  }, [dispatch, username, user?.username]);

  const displayedUser = profileUser || user;
  const isOwnProfile = !username || username === user?.username;

  useEffect(() => {
    reset({
      bio: displayedUser?.bio || "",
    });
  }, [displayedUser, reset]);

  const initials =
    displayedUser?.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    if (!isOwnProfile) return;

    const result = await dispatch(
      updateProfile({
        bio: data.bio,
        avatar,
        coverImage,
      })
    );

    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
      setAvatar(null);
      setCoverImage(null);
      setAvatarPreview("");
      setCoverPreview("");
    } else {
      toast.error(result.payload || "Failed to update profile");
    }
  };

  const handleFollowToggle = async () => {
    if (!displayedUser?._id || isOwnProfile) return;

    const action = isFollowingProfile ? unfollowUser : followUser;
    const result = await dispatch(action(displayedUser._id));

    if (action.fulfilled.match(result)) {
      toast.success(isFollowingProfile ? "Unfollowed" : "Following");
    } else {
      toast.error(result.payload || "Something went wrong");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="relative h-52 bg-gradient-to-br from-blue-500 to-indigo-600">
            {(coverPreview || displayedUser?.coverImage) && (
              <img
                src={coverPreview || displayedUser.coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            )}

            {isOwnProfile && (
              <label className="absolute right-4 top-4 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 text-slate-700 text-sm font-semibold shadow-sm hover:bg-white cursor-pointer transition">
                <Image className="w-4 h-4" strokeWidth={2} />
                Cover
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                    {(avatarPreview || displayedUser?.profilePicture) ? (
                      <img
                        src={avatarPreview || displayedUser.profilePicture}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-black text-white">
                        {initials}
                      </span>
                    )}
                  </div>

                  {isOwnProfile && (
                    <label className="absolute -right-2 -bottom-2 p-2 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 cursor-pointer transition">
                      <Camera className="w-4 h-4" strokeWidth={2} />
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="pb-2">
                  <h1 className="text-2xl font-black text-slate-800">
                    {displayedUser?.fullName || "User"}
                  </h1>
                  <p className="text-sm text-slate-400">
                    @{displayedUser?.username || "username"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-black text-slate-800">
                    {profilePosts.length}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Posts</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-black text-slate-800">
                    {displayedUser?.followers?.length || 0}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Followers</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-black text-slate-800">
                    {displayedUser?.following?.length || 0}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Following</p>
                </div>
              </div>
            </div>

            {isOwnProfile ? (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  maxLength={180}
                  placeholder="Tell people a little about you..."
                  {...register("bio")}
                  className="w-full resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />

                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 shadow-sm hover:shadow-md hover:shadow-indigo-200/60"
                  >
                    <Save className="w-4 h-4" strokeWidth={2} />
                    Save profile
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {displayedUser?.bio || "No bio yet."}
                </p>
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={loading}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                    isFollowingProfile
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white hover:shadow-md hover:shadow-indigo-200/60"
                  }`}
                >
                  {isFollowingProfile ? (
                    <UserMinus className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <UserPlus className="w-4 h-4" strokeWidth={2} />
                  )}
                  {isFollowingProfile ? "Unfollow" : "Follow"}
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4">
            {isOwnProfile ? "Your posts" : "Posts"}
          </h2>
          {profilePosts.length === 0 ? (
            <p className="text-sm text-slate-500">No posts yet.</p>
          ) : (
            <div className="space-y-3">
              {profilePosts.map((post) => (
                <article key={post._id} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {post.content}
                  </p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="mt-3 max-h-80 w-full rounded-xl object-cover"
                    />
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
