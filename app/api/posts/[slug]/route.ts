import { NextRequest, NextResponse } from "next/server";
import { getPost, savePost, deletePost } from "@/lib/posts";
import { isAuthenticated } from "@/lib/auth";
import { isGitHubConfigured, getPostsIndex, getPostContent, savePostToGitHub, deletePostFromGitHub, triggerVercelDeploy } from "@/lib/github";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (isGitHubConfigured()) {
    const posts = await getPostsIndex();
    const meta = posts.find((p) => p.slug === slug);
    if (!meta) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const content = await getPostContent(slug);
    if (!content) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...meta, content });
  }

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
  const excerpt = content.replace(/[#*`>\[\]]/g, "").slice(0, 160).trim();
  const post = { slug: slug || oldSlug, title, date, category: category || "", excerpt };

  if (isGitHubConfigured()) {
    if (slug !== oldSlug) await deletePostFromGitHub(oldSlug);
    await savePostToGitHub(post, content);
    triggerVercelDeploy();
  } else {
    if (slug !== oldSlug) deletePost(oldSlug);
    savePost(post, content);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { slug } = await params;

  if (isGitHubConfigured()) {
    await deletePostFromGitHub(slug);
    triggerVercelDeploy();
  } else {
    deletePost(slug);
  }
  return NextResponse.json({ ok: true });
}
