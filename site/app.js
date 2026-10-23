// GitHub's own language colors, for the few languages used here.
const COLORS = {
  Kotlin: "#A97BFF",
  Vue: "#41b883",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Java: "#b07219",
  Swift: "#F05138",
  Python: "#3572A5",
  C: "#555555",
};

const $ = (id) => document.getElementById(id);

/** "website-Tour" → "Website Tour" */
function prettify(name) {
  const words = name.replace(/[-_]+/g, " ").trim().replace(/\bios\b/gi, "iOS");
  return words.startsWith("iOS") ? words : words.charAt(0).toUpperCase() + words.slice(1);
}

const relative = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

function since(iso) {
  const days = Math.round((Date.parse(iso) - Date.now()) / 86400000);
  if (days > -1) return "aujourd'hui";
  if (days > -30) return relative.format(days, "day");
  if (days > -365) return relative.format(Math.round(days / 30), "month");
  return relative.format(Math.round(days / 365), "year");
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function card(project, index) {
  const article = el("article", "card");
  article.style.setProperty("--i", Math.min(index, 12));

  const top = el("div", "card-top");
  const title = el("h2");
  const link = el("a", "card-link", prettify(project.name));
  link.href = project.url;
  link.setAttribute("aria-label", `${prettify(project.name)} sur GitHub`);
  title.append(link);
  top.append(title, el("span", "arrow", "↗"));
  article.append(top);

  if (project.description) article.append(el("p", null, project.description));

  const foot = el("div", "card-foot");
  if (project.language) {
    const lang = el("span", "lang");
    const dot = el("span", "dot");
    if (COLORS[project.language]) dot.style.setProperty("--c", COLORS[project.language]);
    lang.append(dot, project.language);
    foot.append(lang);
  }
  foot.append(el("span", null, `Mis à jour ${since(project.pushed)}`));
  if (project.fork) foot.append(el("span", "tag", "fork"));
  if (project.homepage) {
    const site = el("a", "site", "Voir le site");
    site.href = project.homepage;
    foot.append(site);
  }
  article.append(foot);
  return article;
}

function render(data) {
  $("name").textContent = data.name;
  $("bar-name").textContent = data.name;
  document.title = `${data.name} · Projets`;
  if (data.bio) $("bio").textContent = data.bio;
  if (data.avatar) {
    $("avatar").src = data.avatar;
    $("avatar").hidden = false;
  }
  if (data.profile) $("profile").href = data.profile;

  const count = data.projects.length;
  $("meta").textContent = [data.location, `${count} projet${count > 1 ? "s" : ""}`].filter(Boolean).join(" · ");

  const grid = $("grid");
  grid.replaceChildren(...data.projects.map(card));
}

async function load() {
  try {
    const response = await fetch("repos.json", { cache: "no-cache" });
    render(await response.json());
  } catch {
    $("empty").textContent = "Impossible de charger les projets. Réessaie dans un instant.";
  }
}

// The bar gets its hairline and title only once the hero has scrolled away.
const bar = document.querySelector(".bar");
new IntersectionObserver(([entry]) => bar.classList.toggle("scrolled", !entry.isIntersecting), {
  rootMargin: "-52px 0px 0px 0px",
}).observe($("name"));

load();
