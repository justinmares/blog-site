import fs from "fs";
import path from "path";

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_DIR = path.join(process.cwd(), "content", "posts");
const INDEX_FILE = path.join(DATA_DIR, "posts.json");

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
  if (!fs.existsSync(INDEX_FILE)) fs.writeFileSync(INDEX_FILE, "[]");
}

export function getAllPosts(): Post[] {
  ensureDirs();
  const raw = fs.readFileSync(INDEX_FILE, "utf-8");
  const posts: Post[] = JSON.parse(raw);
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): (Post & { content: string }) | null {
  ensureDirs();
  const posts = getAllPosts();
  const meta = posts.find((p) => p.slug === slug);
  if (!meta) return null;
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  return { ...meta, content };
}

export function savePost(post: Post, content: string) {
  ensureDirs();
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === post.slug);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    posts.push(post);
  }
  fs.writeFileSync(INDEX_FILE, JSON.stringify(posts, null, 2));
  fs.writeFileSync(path.join(CONTENT_DIR, `${post.slug}.md`), content);
}

export function deletePost(slug: string) {
  ensureDirs();
  const posts = getAllPosts().filter((p) => p.slug !== slug);
  fs.writeFileSync(INDEX_FILE, JSON.stringify(posts, null, 2));
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  return [...new Set(posts.map((p) => p.category).filter(Boolean))];
}
