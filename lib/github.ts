const REPO = process.env.GITHUB_REPO || "justinmares/blog-site";
const TOKEN = process.env.GITHUB_TOKEN || "";
const BRANCH = "master";

async function githubApi(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    method,
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${res.status}: ${text}`);
  }
  return res.json();
}

async function getFileSha(path: string): Promise<string | null> {
  try {
    const data = await githubApi(`/contents/${path}?ref=${BRANCH}`);
    return data.sha;
  } catch {
    return null;
  }
}

async function getFileContent(path: string): Promise<string | null> {
  try {
    const data = await githubApi(`/contents/${path}?ref=${BRANCH}`);
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

async function putFile(path: string, content: string, message: string) {
  const sha = await getFileSha(path);
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content).toString("base64"),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;
  return githubApi(`/contents/${path}`, "PUT", body);
}

async function deleteFile(path: string, message: string) {
  const sha = await getFileSha(path);
  if (!sha) return;
  return githubApi(`/contents/${path}`, "DELETE", {
    message,
    sha,
    branch: BRANCH,
  });
}

// --- Public API ---

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

export async function getPostsIndex(): Promise<Post[]> {
  const raw = await getFileContent("data/posts.json");
  if (!raw) return [];
  const posts: Post[] = JSON.parse(raw);
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostContent(slug: string): Promise<string | null> {
  return getFileContent(`content/posts/${slug}.md`);
}

export async function savePostToGitHub(post: Post, content: string) {
  // Update the markdown file
  await putFile(`content/posts/${post.slug}.md`, content, `Add/update post: ${post.title}`);

  // Update the index
  const posts = await getPostsIndex();
  const idx = posts.findIndex((p) => p.slug === post.slug);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    posts.push(post);
  }
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  await putFile("data/posts.json", JSON.stringify(posts, null, 2), `Update posts index: ${post.title}`);
}

export async function deletePostFromGitHub(slug: string) {
  await deleteFile(`content/posts/${slug}.md`, `Delete post: ${slug}`);

  const posts = await getPostsIndex();
  const filtered = posts.filter((p) => p.slug !== slug);
  await putFile("data/posts.json", JSON.stringify(filtered, null, 2), `Remove from index: ${slug}`);
}

export async function triggerVercelDeploy() {
  const vercelToken = process.env.VERCEL_DEPLOY_TOKEN;
  const projectId = process.env.VERCEL_DEPLOY_PROJECT_ID;
  if (!vercelToken || !projectId) return;

  const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "blog-site",
      project: projectId,
      target: "production",
      gitSource: {
        type: "github",
        repo: REPO.split("/")[1],
        org: REPO.split("/")[0],
        ref: BRANCH,
      },
    }),
  });
  if (!deployRes.ok) {
    // Non-critical — post is saved even if deploy fails
    console.error("Deploy trigger failed:", await deployRes.text());
  }
}

export function isGitHubConfigured(): boolean {
  return !!TOKEN && !!REPO;
}
