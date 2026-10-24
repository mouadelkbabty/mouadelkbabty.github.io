// Builds the site into _site/: copies the static page and writes repos.json from the GitHub API,
// enriched with the hand-written descriptions in data/projects.json.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const USER = "mouadelkbabty";
// Profile READMEs and this site itself are not projects.
const HIDDEN = new Set(["mouadelkbabty", "mouad-elkbabty", "mouadelkbabty.github.io"]);
// Category for a project that has no hand-written entry yet.
const CATEGORY_BY_LANGUAGE = {
  Java: "java",
  Kotlin: "mobile",
  Swift: "mobile",
  Python: "data",
  R: "data",
  "Jupyter Notebook": "data",
  C: "systeme",
  Rust: "systeme",
  Shell: "systeme",
};

const curated = JSON.parse(readFileSync("data/projects.json", "utf8"));
const english = JSON.parse(readFileSync("data/en.json", "utf8"));

async function get(path) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": USER };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

/** "website-Tour" → "Website Tour" */
function prettify(name) {
  const words = name.replace(/[-_]+/g, " ").trim().replace(/\bios\b/gi, "iOS");
  return words.startsWith("iOS") ? words : words.charAt(0).toUpperCase() + words.slice(1);
}

const user = await get(`/users/${USER}`);
const repos = [];
for (let page = 1; ; page++) {
  const batch = await get(`/users/${USER}/repos?per_page=100&page=${page}`);
  repos.push(...batch);
  if (batch.length < 100) break;
}

const visible = repos
  .filter((r) => !r.archived && !HIDDEN.has(r.name.toLowerCase()))
  .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));

const projects = await Promise.all(
  visible.map(async (r) => {
    const info = curated[r.name] || {};
    const en = english[r.name] || {};
    let languages = {};
    try {
      languages = await get(`/repos/${USER}/${r.name}/languages`);
    } catch (error) {
      console.warn(error.message); // the page simply hides the bar
    }
    return {
      name: r.name,
      title: info.title || prettify(r.name),
      tagline: info.tagline || r.description || null,
      about: info.about || r.description || null,
      tech: info.tech || (r.language ? [r.language] : []),
      category: info.category || CATEGORY_BY_LANGUAGE[r.language] || "web",
      featured: Boolean(info.featured),
      shot: info.shot || null,
      // English texts fall back to the French (or GitHub) ones when missing
      en: {
        title: en.title || info.title || prettify(r.name),
        tagline: en.tagline || r.description || info.tagline || null,
        about: en.about || r.description || info.about || null,
      },
      url: r.html_url,
      site: info.site || r.homepage || null,
      language: r.language,
      languages,
      fork: r.fork,
      stars: r.stargazers_count,
      created: r.created_at,
      pushed: r.pushed_at,
    };
  }),
);

const missing = projects.filter((p) => !curated[p.name]).map((p) => p.name);
if (missing.length) console.warn(`no description yet: ${missing.join(", ")}`);
const untranslated = projects.filter((p) => curated[p.name] && !english[p.name]).map((p) => p.name);
if (untranslated.length) console.warn(`no English text yet: ${untranslated.join(", ")}`);

const data = {
  name: user.name || USER,
  bio: user.bio,
  location: user.location?.replace(/\s*,\s*/g, ", ").trim(),
  avatar: user.avatar_url,
  profile: user.html_url,
  projects,
};

mkdirSync("_site", { recursive: true });
cpSync("site", "_site", { recursive: true });
writeFileSync("_site/repos.json", JSON.stringify(data));
console.log(`${projects.length} projects`);
