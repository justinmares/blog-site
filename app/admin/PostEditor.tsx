"use client";

import { useState } from "react";
import Link from "next/link";

interface PostEditorProps {
  onSave: (data: { title: string; slug: string; category: string; content: string }) => void;
  saving: boolean;
  initial?: { title: string; slug: string; category: string; content: string };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function PostEditor({ onSave, saving, initial }: PostEditorProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [content, setContent] = useState(initial?.content || "");
  const [autoSlug, setAutoSlug] = useState(!initial);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (autoSlug) setSlug(slugify(val));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ title: title.trim(), slug: slug || slugify(title), category: category.trim(), content });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm text-text-muted">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
          placeholder="Post title"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-text-muted">Slug (URL)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
            placeholder="post-url-slug"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-muted">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
            placeholder="e.g. Health, AI, Startups"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-text-muted">Content (Markdown)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
          placeholder="Write your post in Markdown..."
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-6 py-3 font-medium text-bg hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Post"}
        </button>
        <Link href="/admin" className="rounded-lg border border-border px-6 py-3 text-text-muted hover:border-accent transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  );
}
