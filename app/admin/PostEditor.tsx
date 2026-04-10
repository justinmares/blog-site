"use client";

import { useState, useRef, DragEvent } from "react";
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
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (autoSlug) setSlug(slugify(val));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ title: title.trim(), slug: slug || slugify(title), category: category.trim(), content });
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        alert(`Upload failed: ${err.error || "Unknown error"}`);
        return;
      }
      const { url } = await res.json();
      insertAtCursor(`![${file.name}](${url})`);
    } catch (err) {
      alert("Upload failed — check your connection.");
    } finally {
      setUploading(false);
    }
  }

  function insertAtCursor(text: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + "\n" + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const newContent = before + text + after;
    setContent(newContent);
    // Restore cursor position after the inserted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      uploadImage(files[0]);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    // Reset input so the same file can be selected again
    e.target.value = "";
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
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm text-text-muted">Content (Markdown)</label>
          <div className="flex items-center gap-2">
            {uploading && <span className="text-xs text-accent">Uploading image...</span>}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded border border-border px-3 py-1 text-xs text-text-muted hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
            >
              + Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
        <div
          className={`relative rounded-lg border transition-colors ${
            dragOver ? "border-accent bg-accent/10" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {dragOver && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-accent/10">
              <span className="text-accent font-medium">Drop image to upload</span>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full rounded-lg bg-surface px-4 py-3 font-mono text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
            placeholder="Write your post in Markdown... Drag & drop images here."
            required
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-6 py-3 font-medium text-text hover:bg-accent-hover transition-colors disabled:opacity-50"
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
