import { NextRequest, NextResponse } from "next/server";
import { getPost, savePost, deletePost } from "@/lib/posts";
import { isAuthenticated } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { slug: oldSlug } = await params;
  const { title, slug, date, category, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  // If slug changed, delete old one
  if (slug !== oldSlug) deletePost(oldSlug);
  const excerpt = content.replace(/[#*`>\[\]]/g, "").slice(0, 160).trim();
  savePost({ slug: slug || oldSlug, title, date, category: category || "", excerpt }, content);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { slug } = await params;
  deletePost(slug);
  return NextResponse.json({ ok: true });
}
