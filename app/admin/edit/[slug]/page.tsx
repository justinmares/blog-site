"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import PostEditor from "../../PostEditor";

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [initial, setInitial] = useState<{ title: string; slug: string; category: string; content: string; date: string } | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${slug}`).then((r) => r.json()).then(setInitial);
  }, [slug]);

  async function handleSave(data: { title: string; slug: string; category: string; content: string }) {
    setSaving(true);
    const res = await fetch(`/api/posts/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, date: initial?.date || new Date().toISOString().split("T")[0] }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Error saving post");
      setSaving(false);
    }
  }

  if (!initial) return <div className="text-text-muted">Loading...</div>;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Edit Post</h1>
      <PostEditor onSave={handleSave} saving={saving} initial={initial} />
    </div>
  );
}
