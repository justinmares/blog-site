"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then(setPosts);
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${slug}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.slug !== slug));
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Posts</h1>
        <Link
          href="/admin/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover transition-colors"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-text-muted">No posts yet. Create your first one!</p>
      ) : (
        <div className="space-y-1">
          {posts.map((post) => (
            <div key={post.slug} className="flex items-center justify-between border-b border-border py-4">
              <div>
                <h2 className="font-medium">{post.title}</h2>
                <p className="text-sm text-text-muted">
                  {new Date(post.date).toLocaleDateString()} {post.category && `· ${post.category}`}
                </p>
              </div>
              <div className="flex gap-3">
                <Link href={`/admin/edit/${post.slug}`} className="text-sm text-accent hover:text-accent-hover transition-colors">
                  Edit
                </Link>
                <button onClick={() => handleDelete(post.slug)} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
