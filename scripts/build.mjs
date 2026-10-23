// Builds the site into _site/: copies the static page and writes repos.json from the GitHub API.
import { cpSync, mkdirSync, writeFileSync } from "node:fs";

const USER = "mouadelkbabty";
// Profile READMEs and this site itself are not projects.
const HIDDEN = new Set(["mouadelkbabty", "mouad-elkbabty", "mouadelkbabty.github.io"]);

async function get(path) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": USER };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

const user = await get(`/users/${USER}`);
const repos = [];
for (let page = 1; ; page++) {
  const batch = await get(`/users/${USER}/repos?per_page=100&page=${page}`);
  repos.push(...batch);
  if (batch.length < 100) break;
}

const projects = repos
  .filter((r) => !r.archived && !HIDDEN.has(r.name.toLowerCase()))
  .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
  .map((r) => ({
    name: r.name,
    description: r.description,
    url: r.html_url,
    homepage: r.homepage || null,
    language: r.language,
    fork: r.fork,
    stars: r.stargazers_count,
    pushed: r.pushed_at,
  }));

const data = {
  name: user.name || USER,
  bio: user.bio,
  location: user.location,
  avatar: user.avatar_url,
  profile: user.html_url,
  projects,
};

mkdirSync("_site", { recursive: true });
cpSync("site", "_site", { recursive: true });
writeFileSync("_site/repos.json", JSON.stringify(data));
console.log(`${projects.length} projects`);
