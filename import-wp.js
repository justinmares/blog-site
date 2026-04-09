const fs = require("fs");
const path = require("path");

// Simple CSV parser that handles quoted fields with newlines
function parseCSV(text) {
  const rows = [];
  let i = 0;

  // Parse header
  const headerEnd = findRowEnd(text, 0);
  const header = parseRow(text.substring(0, headerEnd));
  i = headerEnd + 1;

  while (i < text.length) {
    const end = findRowEnd(text, i);
    if (end === i) { i++; continue; }
    const row = parseRow(text.substring(i, end));
    if (row.length === header.length) {
      const obj = {};
      header.forEach((h, idx) => obj[h] = row[idx]);
      rows.push(obj);
    }
    i = end + 1;
  }
  return rows;
}

function findRowEnd(text, start) {
  let i = start;
  let inQuote = false;
  while (i < text.length) {
    if (text[i] === '"') inQuote = !inQuote;
    if (text[i] === '\n' && !inQuote) return i;
    i++;
  }
  return i;
}

function parseRow(line) {
  const fields = [];
  let i = 0;
  while (i <= line.length) {
    if (i >= line.length) { fields.push(""); break; }
    if (line[i] === '"') {
      let val = "";
      i++; // skip opening quote
      while (i < line.length) {
        if (line[i] === '"' && line[i+1] === '"') { val += '"'; i += 2; }
        else if (line[i] === '"') { i++; break; }
        else { val += line[i]; i++; }
      }
      fields.push(val);
      if (line[i] === ',') i++; // skip comma
    } else {
      let end = line.indexOf(',', i);
      if (end === -1) end = line.length;
      fields.push(line.substring(i, end));
      i = end + 1;
    }
  }
  return fields;
}

// Convert HTML to basic markdown
function htmlToMarkdown(html) {
  if (!html) return "";
  let md = html;
  // Remove images (WordPress-specific)
  md = md.replace(/<img[^>]*>/gi, "");
  // Headers
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1");
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1");
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1");
  // Bold/italic
  md = md.replace(/<strong>(.*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b>(.*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em>(.*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i>(.*?)<\/i>/gi, "*$1*");
  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  // Lists
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1");
  md = md.replace(/<\/?[uo]l[^>]*>/gi, "");
  // Paragraphs and breaks
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<p[^>]*>/gi, "\n\n");
  md = md.replace(/<\/p>/gi, "");
  // Blockquotes
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, "> $1");
  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, "");
  // HTML entities
  md = md.replace(/&amp;/g, "&");
  md = md.replace(/&lt;/g, "<");
  md = md.replace(/&gt;/g, ">");
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#8217;/g, "'");
  md = md.replace(/&#8220;/g, '"');
  md = md.replace(/&#8221;/g, '"');
  md = md.replace(/&#8230;/g, "...");
  md = md.replace(/&#8211;/g, "–");
  md = md.replace(/&#8212;/g, "—");
  md = md.replace(/&nbsp;/g, " ");
  // Clean up whitespace
  md = md.replace(/\n{3,}/g, "\n\n");
  md = md.trim();
  return md;
}

// Main
const csv = fs.readFileSync("/Users/justinmares1_1/Downloads/wp_posts.csv", "utf-8");
const rows = parseCSV(csv);

// Filter to published posts only (not pages, revisions, etc)
const posts = rows.filter(r =>
  r.post_status === "publish" &&
  r.post_type === "post" &&
  r.post_name &&
  r.post_content &&
  r.post_content.trim().length > 50
);

console.log(`Found ${posts.length} published posts`);

const contentDir = path.join(__dirname, "content", "posts");
const dataDir = path.join(__dirname, "data");

if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Load existing posts
const indexFile = path.join(dataDir, "posts.json");
let existingPosts = [];
if (fs.existsSync(indexFile)) {
  existingPosts = JSON.parse(fs.readFileSync(indexFile, "utf-8"));
}

const existingSlugs = new Set(existingPosts.map(p => p.slug));
let imported = 0;

for (const row of posts) {
  const slug = row.post_name.replace(/[^a-z0-9-]/g, "");
  if (!slug || existingSlugs.has(slug)) continue;

  const content = htmlToMarkdown(row.post_content);
  if (content.length < 30) continue;

  const date = row.post_date ? row.post_date.split(" ")[0] : "2020-01-01";
  const title = row.post_title || slug;
  const excerpt = content.replace(/[#*`>\[\]()-]/g, "").slice(0, 160).trim();

  existingPosts.push({ slug, title, date, category: "", excerpt });
  fs.writeFileSync(path.join(contentDir, `${slug}.md`), content);
  existingSlugs.add(slug);
  imported++;
}

// Sort by date descending
existingPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
fs.writeFileSync(indexFile, JSON.stringify(existingPosts, null, 2));

console.log(`Imported ${imported} posts. Total: ${existingPosts.length}`);
