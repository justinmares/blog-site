import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { isGitHubConfigured, putBinaryFile } from "@/lib/github";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("image") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  // Create a unique filename
  const ext = file.name.split(".").pop() || "png";
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase()
    .slice(0, 50);
  const filename = `${timestamp}-${safeName}.${ext}`;
  const imagePath = `images/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  if (isGitHubConfigured()) {
    // Production: commit to GitHub repo and return raw GitHub URL (instantly available)
    const repo = process.env.GITHUB_REPO || "justinmares/blog-site";
    await putBinaryFile(`public/${imagePath}`, base64, `Upload image: ${filename}`);
    const rawUrl = `https://raw.githubusercontent.com/${repo}/master/public/${imagePath}`;
    return NextResponse.json({ url: rawUrl });
  } else {
    // Dev: save to local public/images/
    const localPath = path.join(process.cwd(), "public", imagePath);
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, buffer);
    return NextResponse.json({ url: `/${imagePath}` });
  }
}
