import Link from "next/link";
import { getPost, getAllPosts } from "@/lib/posts";
import { marked } from "marked";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = await marked(post.content);

  return (
    <article>
      <div className="mb-8">
        <Link href="/" className="text-sm text-text-muted hover:text-accent transition-colors">&larr; Back</Link>
      </div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <time>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
          {post.category && <span className="rounded bg-surface px-2 py-0.5 text-xs">{post.category}</span>}
        </div>
      </header>
      <div className="prose-blog" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
