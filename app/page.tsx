import Link from "next/link";
import { getAllPosts, getCategories } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return <HomeInner searchParamsPromise={searchParams} />;
}

async function HomeInner({ searchParamsPromise }: { searchParamsPromise: Promise<{ category?: string }> }) {
  const { category } = await searchParamsPromise;
  const allPosts = getAllPosts();
  const categories = getCategories();
  const posts = category ? allPosts.filter((p) => p.category === category) : allPosts;

  return (
    <div>
      {/* Category filters */}
      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/"
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            !category ? "bg-accent text-bg font-medium" : "bg-surface text-text-muted hover:bg-surface-hover"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              category === cat ? "bg-accent text-bg font-medium" : "bg-surface text-text-muted hover:bg-surface-hover"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <p className="text-text-muted">No posts yet.</p>
      ) : (
        <div className="space-y-1">
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="group block">
              <div className="flex items-baseline justify-between gap-4 border-b border-border py-4 transition-colors group-hover:border-accent">
                <h2 className="font-medium text-text group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-text-muted">
                    {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  {post.category && (
                    <span className="rounded bg-surface px-2 py-0.5 text-xs text-text-muted">
                      {post.category}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
