import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

const projects = [
  {
    name: "TrueMed",
    url: "https://truemed.com",
    description: "HSA/FSA payments for health products",
  },
  {
    name: "Kettle & Fire",
    url: "https://kettleandfire.com",
    description: "Bone broth & shelf-stable soups",
    note: "exited",
  },
];

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 5);

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="pt-8">
        <h1 className="font-serif text-4xl font-semibold tracking-tight leading-tight mb-4">
          Justin Mares
        </h1>
        <p className="text-lg text-text-muted leading-relaxed max-w-xl">
          Building companies at the intersection of health and technology.
        </p>
      </section>

      {/* Building */}
      <section>
        <h2 className="font-serif text-xl font-medium text-text-muted mb-6 tracking-wide">
          What I&apos;m building
        </h2>
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.name} className="group">
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-baseline gap-2"
              >
                <span className="font-serif text-lg font-medium text-text group-hover:text-accent-hover transition-colors">
                  {p.name}
                </span>
                {p.note && (
                  <span className="text-xs text-text-muted">({p.note})</span>
                )}
              </a>
              <p className="text-text-muted text-sm mt-0.5">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Writing */}
      <section>
        <h2 className="font-serif text-xl font-medium text-text-muted mb-6 tracking-wide">
          What I&apos;m thinking
        </h2>
        <div className="space-y-0">
          {recentPosts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="group block">
              <div className="flex items-baseline justify-between gap-4 border-b border-border py-3.5 group-hover:border-accent transition-colors">
                <span className="text-text group-hover:text-accent-hover transition-colors">
                  {post.title}
                </span>
                <span className="shrink-0 text-xs text-text-muted">
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/essays"
          className="inline-block mt-5 text-sm text-text-muted hover:text-accent-hover transition-colors"
        >
          See all essays &rarr;
        </Link>
      </section>

      {/* Connect */}
      <section>
        <h2 className="font-serif text-xl font-medium text-text-muted mb-6 tracking-wide">
          Say hello
        </h2>
        <div className="flex gap-6 text-sm">
          <a
            href="https://twitter.com/jwmares"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-accent-hover transition-colors"
          >
            X / Twitter
          </a>
          <a
            href="https://justinmares.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-accent-hover transition-colors"
          >
            Substack
          </a>
          <a
            href="mailto:justin@truemed.com"
            className="text-text-muted hover:text-accent-hover transition-colors"
          >
            Email
          </a>
        </div>
      </section>
    </div>
  );
}
