import Link from "next/link";
import { getAllPostsAsync, getCategoriesAsync } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function Essays({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return <EssaysInner searchParamsPromise={searchParams} />;
}

async function EssaysInner({ searchParamsPromise }: { searchParamsPromise: Promise<{ category?: string }> }) {
  const { category } = await searchParamsPromise;
  const allPosts = await getAllPostsAsync();
  const categories = await getCategoriesAsync();
  const posts = category ? allPosts.filter((p) => p.category === category) : allPosts;

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold tracking-tight mb-8">Essays</h1>

      {/* Category filters */}
      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/essays"
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            !category ? "bg-accent text-text font-medium" : "bg-surface text-text-muted hover:bg-surface-hover"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/essays?category=${encodeURIComponent(cat)}`}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              category === cat ? "bg-accent text-text font-medium" : "bg-surface text-text-muted hover:bg-surface-hover"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <p className="text-text-muted">No essays yet.</p>
      ) : (
        <div className="space-y-0">
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="group block">
              <div className="flex items-baseline justify-between gap-4 border-b border-border py-3.5 group-hover:border-accent transition-colors">
                <span className="text-text group-hover:text-accent-hover transition-colors">
                  {post.title}
                </span>
                <span className="shrink-0 text-xs text-text-muted">
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
