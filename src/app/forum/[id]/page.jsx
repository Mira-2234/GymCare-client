"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Image from "next/image";

function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#14151A] px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-white/5" />
        <div className="h-20 w-full animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}

function AuthorBadge({ role }) {
  const isAdmin = role === "admin";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        isAdmin ? "bg-red-400/10 text-red-400" : "bg-[#FF5B3C]/10 text-[#FF5B3C]"
      }`}
    >
      {isAdmin ? "Admin" : "Trainer"}
    </span>
  );
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function CommentItem({ comment, currentUserEmail, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const isOwner = comment.userEmail === currentUserEmail;

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    onEdit(comment._id, editText.trim());
    setIsEditing(false);
  };

  return (
    <div className="flex gap-3 border-b border-white/5 py-4 last:border-0">
      <Image
        src={comment.userImage || "https://api.dicebear.com/7.x/initials/svg?seed=" + comment.userName}
        alt={comment.userName}
        className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#F5F3EF]">{comment.userName}</span>
            <span className="text-xs text-[#6B6D78]">{timeAgo(comment.createdAt)}</span>
            {comment.editedAt && <span className="text-xs text-[#6B6D78]">(edited)</span>}
          </div>

          {isOwner && !isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-[#9A9CA6] hover:text-[#FF5B3C]"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(comment._id)}
                className="text-xs text-[#9A9CA6] hover:text-red-400"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-[#14151A] p-2 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="rounded-lg bg-[#FF5B3C] px-3 py-1 text-xs font-semibold text-black"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(comment.text);
                }}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-[#9A9CA6]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-sm text-[#9A9CA6]">{comment.text}</p>
        )}
      </div>
    </div>
  );
}

export default function ForumPostDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [voting, setVoting] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/forum/${id}`)}`);
    }
  }, [sessionLoading, session, router, id]);

  // Fetch post
  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        setLikesCount(data.likes?.length || 0);
        setDislikesCount(data.dislikes?.length || 0);
        if (session?.user?.email) {
          if (data.likes?.includes(session.user.email)) setUserVote("like");
          else if (data.dislikes?.includes(session.user.email)) setUserVote("dislike");
        }
      })
      .catch((err) => console.error("Failed to fetch post:", err))
      .finally(() => setLoading(false));
  }, [id, session]);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`)
      .then((r) => r.json())
     
      .then((d) => {
        const safeComments = Array.isArray(d.comments) ? d.comments : [];
        setComments(safeComments.filter((c) => c && c._id));
      })
      .catch((err) => console.error("Failed to fetch comments:", err));
  }, [id]);

  const handleVote = async (voteType) => {
    if (!session?.user) {
      toast.error("Please login to vote.");
      return;
    }

    setVoting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: session.user.email, voteType }),
      });
      const data = await res.json();
      setLikesCount(data.likesCount);
      setDislikesCount(data.dislikesCount);
      setUserVote(data.userVote);
    } catch (err) {
      console.error("Vote error:", err);
      toast.error("Failed to register vote.");
    } finally {
      setVoting(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    if (!session?.user) {
      toast.error("Please login to comment.");
      return;
    }

    setPostingComment(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: id,
          userEmail: session.user.email,
          userName: session.user.name,
          userImage: session.user.image,
          text: commentText,
        }),
      });

      const data = await res.json();

      
      if (!res.ok || !data?.comment?._id) {
        throw new Error(data?.error || "Failed to post comment.");
      }

      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
      toast.success("Comment posted!");
    } catch (err) {
      console.error("Comment post error:", err);
      toast.error(err?.message || "Failed to post comment.");
    } finally {
      setPostingComment(false);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: session.user.email, text: newText }),
      });

      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to update comment.");
      }

      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, text: newText, editedAt: new Date() } : c))
      );
      toast.success("Comment updated.");
    } catch (err) {
      console.error("Edit comment error:", err);
      toast.error(err?.message || "Failed to update comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}?userEmail=${session.user.email}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to delete comment.");
      }

      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted.");
    } catch (err) {
      console.error("Delete comment error:", err);
      toast.error(err?.message || "Failed to delete comment.");
    }
  };

  if (loading || sessionLoading || !session?.user) return <DetailsSkeleton />;

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#14151A]">
        <p className="text-[#9A9CA6]">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#14151A] px-6 py-12">
      <div className="mx-auto max-w-3xl">
   
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/10">
          <Image src={post.image} alt={post.title} className="h-64 w-full object-cover" />
        </div>

      
        <div className="mb-3 flex items-center gap-2">
          <AuthorBadge role={post.authorRole} />
          <span className="text-sm text-[#9A9CA6]">{post.authorName}</span>
          <span className="text-xs text-[#6B6D78]">· {timeAgo(post.createdAt)}</span>
        </div>

   
        <h1 className="text-3xl font-bold text-[#F5F3EF]">{post.title}</h1>

      
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#9A9CA6]">
          {post.description}
        </p>

        
        <div className="mt-6 flex items-center gap-3 border-y border-white/10 py-4">
          <button
            onClick={() => handleVote("like")}
            disabled={voting}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              userVote === "like"
                ? "bg-[#FF5B3C]/15 text-[#FF5B3C]"
                : "bg-white/5 text-[#9A9CA6] hover:bg-white/10"
            } disabled:opacity-60`}
          >
            <svg
              className="h-4 w-4"
              fill={userVote === "like" ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
            </svg>
            {likesCount}
          </button>

          <button
            onClick={() => handleVote("dislike")}
            disabled={voting}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              userVote === "dislike"
                ? "bg-red-400/15 text-red-400"
                : "bg-white/5 text-[#9A9CA6] hover:bg-white/10"
            } disabled:opacity-60`}
          >
            <svg
              className="h-4 w-4"
              fill={userVote === "dislike" ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
            </svg>
            {dislikesCount}
          </button>
        </div>

       
        <div className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#9A9CA6]">
            Comments ({comments.length})
          </h2>

        
          <div className="mb-6 flex gap-3">
            <Image
              src={session.user.image || "https://api.dicebear.com/7.x/initials/svg?seed=" + session.user.name}
              alt={session.user.name}
              className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-[#1C1D24] p-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
              />
              <button
                onClick={handlePostComment}
                disabled={postingComment || !commentText.trim()}
                className="mt-2 rounded-lg bg-[#FF5B3C] px-4 py-2 text-sm font-semibold text-black transition disabled:opacity-50"
              >
                {postingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>

       
          <div className="rounded-2xl border border-white/10 bg-[#1C1D24] p-5">
            {comments.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#6B6D78]">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              
              comments.filter(Boolean).map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUserEmail={session.user.email}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}