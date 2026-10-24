const CATEGORIES = {
  web: "Web",
  java: "Java & Spring",
  data: "Data & IA",
  mobile: "Mobile",
  jeux: "Jeux",
  systeme: "Système & réseau",
};

// GitHub's own language colors.
const LANG_COLORS = {
  Kotlin: "#A97BFF",
  Vue: "#41b883",
  HTML: "#e34c26",
  CSS: "#663399",
  SCSS: "#c6538c",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Java: "#b07219",
  Swift: "#F05138",
  Python: "#3572A5",
  C: "#555555",
  Rust: "#dea584",
  R: "#198CE7",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  XSLT: "#EB8CEB",
  Makefile: "#427819",
  TeX: "#3D6117",
  "Jupyter Notebook": "#DA5B0B",
  Batchfile: "#C1F12E",
  PLpgSQL: "#336790",
};

const MOBILE = matchMedia("(max-width: 720px)");
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)");

const $ = (id) => document.getElementById(id);

let projects = [];
let filter = "all";

// ---------- helpers ----------

function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else if (key === "style") node.style.cssText = value;
    else node.setAttribute(key, value);
  }
  node.append(...children.flat().filter((c) => c != null && c !== false));
  return node;
}

const relative = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

function since(iso) {
  const days = Math.round((Date.parse(iso) - Date.now()) / 86400000);
  if (days > -1) return "aujourd'hui";
  if (days > -30) return relative.format(days, "day");
  if (days > -365) return relative.format(Math.round(days / 30), "month");
  return relative.format(Math.round(days / 365), "year");
}

const monthYear = (iso) => new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

const initial = (title) => [...title][0].toUpperCase();

function chips(list, max = list.length) {
  const shown = list.slice(0, max);
  const rest = list.length - shown.length;
  return el("div", { class: "chips" }, shown.map((t) => el("span", { class: "chip" }, t)), rest > 0 && el("span", { class: "chip" }, `+${rest}`));
}

// ---------- cards ----------

function featuredCard(p, i) {
  return el(
    "article",
    { class: "hero-card", "data-cat": p.category, style: `--i:${i}` },
    el("span", { class: "kicker" }, CATEGORIES[p.category]),
    el("h3", {}, el("a", { class: "stretch", href: p.url, "aria-label": `${p.title} sur GitHub` }, p.title)),
    p.tagline && el("p", {}, p.tagline),
    chips(p.tech, 4),
    el(
      "div",
      { class: "actions" },
      el("button", { class: "btn solid", type: "button", onclick: () => openSheet(p) }, "Info"),
      p.site && el("a", { class: "btn", href: p.site }, "Voir le site ↗"),
    ),
  );
}

function card(p, i) {
  return el(
    "article",
    { class: "card", "data-cat": p.category, style: `--i:${Math.min(i, 14)};view-transition-name:p-${i}` },
    el(
      "div",
      { class: "card-top" },
      el("div", { class: "tile", "aria-hidden": "true" }, initial(p.title)),
      el(
        "div",
        {},
        el("h3", {}, el("a", { class: "stretch", href: p.url, "aria-label": `${p.title} sur GitHub` }, p.title)),
        el("span", { class: "cat" }, CATEGORIES[p.category]),
      ),
    ),
    p.tagline && el("p", {}, p.tagline),
    chips(p.tech, 3),
    el(
      "div",
      { class: "card-foot" },
      el("span", {}, p.fork ? el("span", { class: "tag" }, "fork") : null, p.fork ? " " : "", `Mis à jour ${since(p.pushed)}`),
      el("div", { class: "actions" }, el("button", { class: "btn", type: "button", onclick: () => openSheet(p) }, "Info")),
    ),
  );
}

// ---------- filters ----------

function renderFilters() {
  const counts = { all: projects.length };
  for (const p of projects) counts[p.category] = (counts[p.category] || 0) + 1;
  const keys = ["all", ...Object.keys(CATEGORIES).filter((k) => counts[k])];
  $("filters").replaceChildren(
    ...keys.map((key) =>
      el(
        "button",
        {
          class: "filter",
          type: "button",
          role: "tab",
          "aria-selected": String(key === filter),
          onclick: () => setFilter(key),
        },
        key === "all" ? "Tous" : CATEGORIES[key],
        el("span", { class: "n" }, String(counts[key])),
      ),
    ),
  );
}

function renderGrid() {
  const list = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  $("grid").replaceChildren(...list.map(card));
}

function setFilter(key) {
  if (key === filter) return;
  filter = key;
  const update = () => {
    renderFilters();
    renderGrid();
  };
  if (document.startViewTransition && !REDUCED.matches) document.startViewTransition(update);
  else update();
}

// ---------- info sheet ----------

const sheet = $("sheet");
const panel = $("sheet-panel");

function languageBlock(languages) {
  const entries = Object.entries(languages || {}).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (!total) return null;
  // tiny languages are grouped so the bar stays readable
  const main = entries.filter(([, bytes]) => bytes / total >= 0.02).slice(0, 6);
  const other = total - main.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (other > 0) main.push(["Autres", other]);
  const pct = (bytes) => Math.max(0.1, (bytes / total) * 100);
  const color = (name) => LANG_COLORS[name] || "#8e8e93";
  return [
    el("h4", {}, "Langages"),
    el("div", { class: "langbar" }, main.map(([name, bytes], i) => el("span", { style: `width:${pct(bytes)}%;background:${color(name)};animation-delay:${120 + i * 40}ms`, title: name }))),
    el(
      "div",
      { class: "legend" },
      main.map(([name, bytes]) =>
        el("span", {}, el("span", { class: "dot", style: `--c:${color(name)}` }), el("b", {}, name), ` ${(bytes / total * 100).toFixed(bytes / total < 0.1 ? 1 : 0)} %`),
      ),
    ),
  ];
}

function sheetContent(p) {
  return el(
    "div",
    { "data-cat": p.category },
    el("div", { class: "sheet-cover" }, el("div", { class: "tile", "aria-hidden": "true" }, initial(p.title))),
    el(
      "div",
      { class: "sheet-content" },
      el("span", { class: "cat" }, CATEGORIES[p.category]),
      el("h2", { id: "sheet-title" }, p.title),
      p.tagline && el("p", { class: "tagline" }, p.tagline),
      p.about && [el("h4", {}, "Ce que fait le projet"), el("p", { class: "about" }, p.about)],
      p.tech.length > 0 && [el("h4", {}, "Technologies"), chips(p.tech)],
      languageBlock(p.languages),
      el("h4", {}, "En bref"),
      el(
        "dl",
        { class: "facts" },
        el("div", {}, el("dt", {}, "Créé en"), el("dd", {}, monthYear(p.created))),
        el("div", {}, el("dt", {}, "Dernière mise à jour"), el("dd", {}, since(p.pushed))),
        p.fork && el("div", {}, el("dt", {}, "Origine"), el("dd", {}, "Fork d'un autre dépôt")),
        el("div", {}, el("dt", {}, "Dépôt"), el("dd", {}, p.name)),
      ),
      el(
        "div",
        { class: "sheet-actions" },
        el("a", { class: "btn solid", href: p.url }, "Voir sur GitHub ↗"),
        p.site && el("a", { class: "btn", href: p.site }, "Voir le site ↗"),
      ),
    ),
  );
}

function openSheet(p) {
  history.replaceState(null, "", `#${p.name}`); // shareable link to this sheet
  $("sheet-body").replaceChildren(sheetContent(p));
  panel.scrollTop = 0;
  panel.style.transition = panel.style.transform = "";
  sheet.showModal();
  document.body.classList.add("locked");
  // next frame, so the panel animates in from its closed position
  requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add("open")));
}

let closing = null;

function closeSheet() {
  if (!sheet.open || closing) return;
  history.replaceState(null, "", location.pathname + location.search);
  sheet.classList.remove("open");
  if (MOBILE.matches) {
    // continue from wherever a drag left the panel
    panel.style.transition = "";
    panel.style.transform = "translateY(100%)";
  }
  closing = setTimeout(() => {
    sheet.close();
    document.body.classList.remove("locked");
    panel.style.transform = "";
    closing = null;
  }, REDUCED.matches ? 200 : 380);
}

$("sheet-close").addEventListener("click", closeSheet);
sheet.addEventListener("cancel", (event) => {
  event.preventDefault(); // Escape: animate out instead of vanishing
  closeSheet();
});
sheet.addEventListener("click", (event) => {
  if (event.target === sheet) closeSheet(); // tap on the dimmed backdrop
});

// ---------- drag the bottom sheet down (phone) ----------

/** Where a flick would come to rest (Apple's scroll-deceleration projection). */
const project = (velocity, rate = 0.998) => ((velocity / 1000) * rate) / (1 - rate);

/** Progressive resistance when pulling past the top. */
const rubberband = (over, size, c = 0.55) => (over * size * c) / (size + c * Math.abs(over));

let drag = null;

panel.addEventListener("pointerdown", (event) => {
  if (!MOBILE.matches || !sheet.classList.contains("open")) return;
  const onHandle = event.target.closest(".grabber, .sheet-cover");
  if (!onHandle && panel.scrollTop > 0) return; // the content scrolls instead
  if (event.target.closest("a, button")) return;
  drag = { id: event.pointerId, startY: event.clientY, dy: 0, history: [], armed: Boolean(onHandle) };
});

panel.addEventListener("pointermove", (event) => {
  if (!drag || event.pointerId !== drag.id) return;
  const raw = event.clientY - drag.startY;
  if (!drag.armed) {
    // from the content, only a clear downward pull at the top becomes a drag
    if (raw < -8) return (drag = null);
    if (raw < 10) return;
    drag.armed = true;
    drag.startY = event.clientY;
  }
  if (!drag.captured) {
    panel.setPointerCapture(event.pointerId);
    panel.style.transition = "none";
    drag.captured = true;
  }
  const dy = event.clientY - drag.startY;
  drag.dy = dy >= 0 ? dy : rubberband(dy, panel.offsetHeight);
  panel.style.transform = `translateY(${drag.dy}px)`;
  drag.history.push({ y: event.clientY, t: event.timeStamp });
  if (drag.history.length > 6) drag.history.shift();
  event.preventDefault();
});

function endDrag(event) {
  if (!drag || event.pointerId !== drag.id) return;
  const { dy, history, captured } = drag;
  drag = null;
  if (!captured) return;
  const first = history[0];
  const last = history[history.length - 1];
  const velocity = first && last && last.t > first.t ? ((last.y - first.y) / (last.t - first.t)) * 1000 : 0;
  panel.style.transition = "";
  if (dy + project(velocity) > panel.offsetHeight * 0.4) closeSheet();
  else panel.style.transform = ""; // springs back from where the finger let go
}

panel.addEventListener("pointerup", endDrag);
panel.addEventListener("pointercancel", endDrag);

// ---------- page ----------

function render(data) {
  projects = data.projects;
  $("name").textContent = data.name;
  $("bar-name").textContent = data.name;
  document.title = `${data.name} · Projets`;
  if (data.avatar) {
    $("avatar").src = data.avatar;
    $("avatar").hidden = false;
  }
  if (data.profile) $("profile").href = data.profile;

  const languages = new Set(projects.flatMap((p) => [p.language, ...Object.keys(p.languages || {})]).filter(Boolean));
  const first = projects.reduce((min, p) => (p.created < min ? p.created : min), projects[0]?.created || "");
  $("stat-projects").textContent = projects.length;
  $("stat-tech").textContent = languages.size;
  $("stat-since").textContent = first.slice(0, 4);
  $("stats").hidden = false;

  const featured = projects.filter((p) => p.featured);
  if (featured.length) {
    $("featured").replaceChildren(...featured.map(featuredCard));
    $("featured-block").hidden = false;
  }

  renderFilters();
  renderGrid();

  const linked = projects.find((p) => `#${p.name}` === decodeURIComponent(location.hash));
  if (linked) openSheet(linked);
}

async function load() {
  try {
    const response = await fetch("repos.json", { cache: "no-cache" });
    render(await response.json());
  } catch {
    $("empty").textContent = "Impossible de charger les projets. Réessaie dans un instant.";
  }
}

// The bar gets its hairline and title only once the big name has scrolled away.
const bar = document.querySelector(".bar");
new IntersectionObserver(([entry]) => bar.classList.toggle("scrolled", !entry.isIntersecting), {
  rootMargin: "-52px 0px 0px 0px",
}).observe($("name"));

load();
