"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostEditor from "../PostEditor";

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSave(data: { title: string; slug: string; category: string; content: string }) {
    setSaving(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, date: new Date().toISOString().split("T")[0] }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Error saving post");
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">New Post</h1>
      <PostEditor onSave={handleSave} saving={saving} />
    </div>
  );
}
