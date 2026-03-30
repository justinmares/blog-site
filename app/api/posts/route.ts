import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, savePost } from "@/lib/posts";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(getAllPosts());
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { title, slug, date, category, content } = await request.json();
  if (!title || !slug || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const excerpt = content.replace(/[#*`>\[\]]/g, "").slice(0, 160).trim();
  savePost({ slug, title, date: date || new Date().toISOString().split("T")[0], category: category || "", excerpt }, content);
  return NextResponse.json({ ok: true });
}
