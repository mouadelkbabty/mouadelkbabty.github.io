// ---------- texts ----------

const I18N = {
  fr: {
    eyebrow: "Développeur · Java, web & mobile",
    lead: "Ce que je construis, du back-end Spring aux apps iPhone et Android TV.",
    statProjects: "Projets",
    statLanguages: "Langages",
    statSince: "Depuis",
    skills: "Compétences",
    skillsMore: "Et aussi",
    featured: "À la une",
    all: "Tous les projets",
    allShort: "Tous",
    filterLabel: "Filtrer les projets",
    info: "Info",
    site: "Voir le site ↗",
    github: "Voir sur GitHub ↗",
    updated: (when) => `Mis à jour ${when}`,
    today: "aujourd'hui",
    what: "Ce que fait le projet",
    tech: "Technologies",
    languages: "Langages",
    other: "Autres",
    glance: "En bref",
    created: "Créé en",
    lastUpdate: "Dernière mise à jour",
    origin: "Origine",
    forkOf: "Fork d'un autre dépôt",
    repo: "Dépôt",
    projects: (n) => `${n} projet${n > 1 ? "s" : ""}`,
    footer: "Mis à jour automatiquement depuis GitHub chaque jour.",
    loading: "Chargement…",
    error: "Impossible de charger les projets. Réessaie dans un instant.",
    close: "Fermer",
    onGithub: (title) => `${title} sur GitHub`,
    title: (name) => `${name} · Projets`,
    clearSkill: (name) => `Retirer le filtre ${name}`,
    cats: { web: "Web", java: "Java & Spring", data: "Data & IA", mobile: "Mobile", jeux: "Jeux", systeme: "Système & réseau" },
  },
  en: {
    eyebrow: "Developer · Java, web & mobile",
    lead: "What I build, from Spring back ends to iPhone and Android TV apps.",
    statProjects: "Projects",
    statLanguages: "Languages",
    statSince: "Since",
    skills: "Skills",
    skillsMore: "Also",
    featured: "Featured",
    all: "All projects",
    allShort: "All",
    filterLabel: "Filter projects",
    info: "Info",
    site: "Live site ↗",
    github: "View on GitHub ↗",
    updated: (when) => `Updated ${when}`,
    today: "today",
    what: "What it does",
    tech: "Technologies",
    languages: "Languages",
    other: "Other",
    glance: "At a glance",
    created: "Created",
    lastUpdate: "Last update",
    origin: "Origin",
    forkOf: "Fork of another repository",
    repo: "Repository",
    projects: (n) => `${n} project${n > 1 ? "s" : ""}`,
    footer: "Updated automatically from GitHub every day.",
    loading: "Loading…",
    error: "Couldn't load the projects. Try again in a moment.",
    close: "Close",
    onGithub: (title) => `${title} on GitHub`,
    title: (name) => `${name} · Projects`,
    clearSkill: (name) => `Clear the ${name} filter`,
    cats: { web: "Web", java: "Java & Spring", data: "Data & AI", mobile: "Mobile", jeux: "Games", systeme: "Systems & networking" },
  },
};

// Skills in the order Mouad wants them shown; the first five are the main ones.
// A project uses a skill when one of its technologies matches, or GitHub detected the language.
const SKILLS = [
  { id: "java", name: "Java", icon: "java", main: true, tech: /^java(\s|$)/i, lang: /^Java$/ },
  { id: "python", name: "Python", icon: "python", main: true, tech: /^python/i, lang: /^Python$/ },
  { id: "csharp", name: "C#", icon: "csharp", main: true, tech: /^c#/i, lang: /^C#$/ },
  { id: "angular", name: "Angular", icon: "angular", main: true, tech: /^angular/i },
  { id: "vue", name: "Vue.js", icon: "vue", main: true, tech: /^vue/i, lang: /^Vue$/ },
  { id: "spring", name: "Spring Boot", icon: "spring", tech: /^spring/i },
  { id: "kotlin", name: "Kotlin", icon: "kotlin", tech: /^kotlin/i, lang: /^Kotlin$/ },
  { id: "typescript", name: "TypeScript", icon: "typescript", tech: /^typescript/i, lang: /^TypeScript$/ },
  { id: "javascript", name: "JavaScript", icon: "javascript", tech: /^javascript/i, lang: /^JavaScript$/ },
  { id: "swift", name: "Swift", icon: "swift", tech: /^swift/i, lang: /^Swift$/ },
  { id: "react", name: "React · Next.js", icon: "react", tech: /^(react|next\.js)/i },
  { id: "node", name: "Node.js", icon: "nodejs", tech: /^(node\.js|express)/i },
  { id: "postgresql", name: "PostgreSQL", icon: "postgresql", tech: /^postgresql/i, lang: /^PLpgSQL$/ },
  { id: "docker", name: "Docker", icon: "docker", tech: /^docker/i, lang: /^Dockerfile$/ },
  { id: "firebase", name: "Firebase", icon: "firebase", tech: /^(firebase|firestore)/i },
  { id: "html", name: "HTML · CSS", icon: "html5", tech: /^(html|css|scss)$/i, lang: /^(HTML|CSS|SCSS)$/ },
  { id: "tailwind", name: "Tailwind CSS", icon: "tailwind", tech: /^tailwind/i },
  { id: "c", name: "C", icon: "c", tech: /^c$/i, lang: /^C$/ },
  { id: "r", name: "R", icon: "r", tech: /^r$/i, lang: /^R$/ },
  { id: "actions", name: "GitHub Actions", icon: "githubactions", tech: /^github actions/i },
];

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
const LANG_KEY = "lang";

const $ = (id) => document.getElementById(id);

let data = null;
let projects = [];
let filter = "all"; // a category key
let skillFilter = null; // a skill id, overrides the category
// ?lang=en gives a shareable English link; otherwise the visitor's last choice, then the browser
const urlLang = new URLSearchParams(location.search).get("lang");
let lang = (I18N[urlLang] && urlLang) || savedLang() || (navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en");
let t = I18N[lang];

function savedLang() {
  try {
    return I18N[localStorage.getItem(LANG_KEY)] ? localStorage.getItem(LANG_KEY) : null;
  } catch {
    return null;
  }
}

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

function since(iso) {
  const relative = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  const days = Math.round((Date.parse(iso) - Date.now()) / 86400000);
  if (days > -1) return t.today;
  if (days > -30) return relative.format(days, "day");
  if (days > -365) return relative.format(Math.round(days / 30), "month");
  return relative.format(Math.round(days / 365), "year");
}

const monthYear = (iso) => new Date(iso).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { month: "long", year: "numeric" });

/** Project text in the current language. */
const text = (p, key) => (lang === "en" ? p.en[key] : p[key]);

const initial = (title) => [...title][0].toUpperCase();

const canAnimate = () => Boolean(document.startViewTransition) && !REDUCED.matches;

function chips(list, max = list.length) {
  const shown = list.slice(0, max);
  const rest = list.length - shown.length;
  return el("div", { class: "chips" }, shown.map((name) => el("span", { class: "chip" }, name)), rest > 0 && el("span", { class: "chip" }, `+${rest}`));
}

function shot(p) {
  if (!p.shot) return null;
  return el(
    "div",
    { class: `shot ${p.shot.phone ? "phone" : "wide"}`, "aria-hidden": "true" },
    el("img", { src: p.shot.src, alt: "", loading: "lazy", decoding: "async" }),
  );
}

// ---------- skills ----------

function usesSkill(p, skill) {
  if (p.tech.some((name) => skill.tech.test(name))) return true;
  if (!skill.lang) return false;
  return [p.language, ...Object.keys(p.languages || {})].some((name) => name && skill.lang.test(name));
}

const skillCount = (skill) => projects.filter((p) => usesSkill(p, skill)).length;

function skillTile(skill) {
  const count = skillCount(skill);
  const big = skill.main;
  const content = [
    el("img", { class: "skill-icon", src: `icons/${skill.icon}.svg`, alt: "", width: big ? 44 : 22, height: big ? 44 : 22 }),
    el("span", { class: "skill-name" }, skill.name),
    count > 0 && el("span", { class: "skill-count" }, big ? t.projects(count) : String(count)),
  ];
  const cls = big ? "skill big" : "skill";
  // a skill with projects filters the list below; one without is just shown
  return count > 0
    ? el("button", { class: cls, type: "button", "aria-pressed": String(skillFilter === skill.id), onclick: () => setSkill(skill.id) }, content)
    : el("div", { class: `${cls} static` }, content);
}

function renderSkills() {
  $("skills-main").replaceChildren(...SKILLS.filter((s) => s.main).map(skillTile));
  $("skills-more").replaceChildren(...SKILLS.filter((s) => !s.main).map(skillTile));
  $("skills-block").hidden = false;
}

// ---------- cards ----------

function featuredCard(p, i) {
  const card = el(
    "article",
    { class: `hero-card${p.shot ? " has-shot" : ""}`, "data-cat": p.category, style: `--i:${i}` },
    el(
      "div",
      { class: "hero-text" },
      el("span", { class: "kicker" }, t.cats[p.category]),
      el("h3", {}, el("a", { class: "stretch", href: p.url, "aria-label": t.onGithub(text(p, "title")) }, text(p, "title"))),
      text(p, "tagline") && el("p", {}, text(p, "tagline")),
      chips(p.tech, 4),
      el(
        "div",
        { class: "actions" },
        el("button", { class: "btn solid", type: "button", onclick: () => openSheet(p, card) }, t.info),
        p.site && el("a", { class: "btn", href: p.site }, t.site),
      ),
    ),
    shot(p),
  );
  return card;
}

function card(p, i) {
  const node = el(
    "article",
    { class: "card", "data-cat": p.category, style: `--i:${Math.min(i, 14)};view-transition-name:p-${p.name.replace(/[^\w-]/g, "_")}` },
    el(
      "div",
      { class: "card-top" },
      el("div", { class: "tile", "aria-hidden": "true" }, initial(text(p, "title"))),
      el(
        "div",
        {},
        el("h3", {}, el("a", { class: "stretch", href: p.url, "aria-label": t.onGithub(text(p, "title")) }, text(p, "title"))),
        el("span", { class: "cat" }, t.cats[p.category]),
      ),
    ),
    text(p, "tagline") && el("p", {}, text(p, "tagline")),
    chips(p.tech, 3),
    el(
      "div",
      { class: "card-foot" },
      el("span", {}, p.fork ? el("span", { class: "tag" }, "fork") : null, p.fork ? " " : "", t.updated(since(p.pushed))),
      el("div", { class: "actions" }, el("button", { class: "btn", type: "button", onclick: () => openSheet(p, node) }, t.info)),
    ),
  );
  return node;
}

// ---------- filters ----------

function visibleProjects() {
  if (skillFilter) {
    const skill = SKILLS.find((s) => s.id === skillFilter);
    return projects.filter((p) => usesSkill(p, skill));
  }
  return filter === "all" ? projects : projects.filter((p) => p.category === filter);
}

function renderFilters() {
  const counts = { all: projects.length };
  for (const p of projects) counts[p.category] = (counts[p.category] || 0) + 1;
  const keys = ["all", ...Object.keys(t.cats).filter((k) => counts[k])];
  const pills = keys.map((key) =>
    el(
      "button",
      { class: "filter", type: "button", role: "tab", "aria-selected": String(!skillFilter && key === filter), onclick: () => setFilter(key) },
      key === "all" ? t.allShort : t.cats[key],
      el("span", { class: "n" }, String(counts[key])),
    ),
  );
  if (skillFilter) {
    const skill = SKILLS.find((s) => s.id === skillFilter);
    pills.push(
      el(
        "button",
        { class: "filter skill-pill", type: "button", role: "tab", "aria-selected": "true", "aria-label": t.clearSkill(skill.name), onclick: () => setSkill(null) },
        el("img", { src: `icons/${skill.icon}.svg`, alt: "", width: 14, height: 14 }),
        skill.name,
        el("span", { class: "n" }, "✕"),
      ),
    );
  }
  $("filters").replaceChildren(...pills);
}

function renderGrid() {
  $("grid").replaceChildren(...visibleProjects().map(card));
}

function refreshList() {
  const update = () => {
    renderFilters();
    renderGrid();
    renderSkills();
  };
  if (canAnimate()) document.startViewTransition(update);
  else update();
}

function setFilter(key) {
  if (key === filter && !skillFilter) return;
  filter = key;
  skillFilter = null;
  refreshList();
}

function setSkill(id) {
  skillFilter = skillFilter === id ? null : id;
  filter = "all";
  refreshList();
  if (skillFilter) $("all-block").scrollIntoView({ behavior: REDUCED.matches ? "auto" : "smooth", block: "start" });
}

// ---------- info sheet ----------

const sheet = $("sheet");
const panel = $("sheet-panel");
let current = null; // project shown in the sheet
let source = null; // the card it grew out of

function languageBlock(languages) {
  const entries = Object.entries(languages || {}).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (!total) return null;
  // tiny languages are grouped so the bar stays readable
  const main = entries.filter(([, bytes]) => bytes / total >= 0.02).slice(0, 6);
  const other = total - main.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (other > 0) main.push([t.other, other]);
  const pct = (bytes) => Math.max(0.1, (bytes / total) * 100);
  const color = (name) => LANG_COLORS[name] || "#8e8e93";
  const share = (bytes) => (bytes / total * 100).toFixed(bytes / total < 0.1 ? 1 : 0);
  return [
    el("h4", {}, t.languages),
    el("div", { class: "langbar" }, main.map(([name, bytes], i) => el("span", { style: `width:${pct(bytes)}%;background:${color(name)};animation-delay:${120 + i * 40}ms`, title: name }))),
    el("div", { class: "legend" }, main.map(([name, bytes]) => el("span", {}, el("span", { class: "dot", style: `--c:${color(name)}` }), el("b", {}, name), ` ${share(bytes)} %`))),
  ];
}

function sheetContent(p) {
  return el(
    "div",
    { "data-cat": p.category },
    el(
      "div",
      { class: `sheet-cover${p.shot ? " has-shot" : ""}` },
      p.shot && el("div", { class: "cover-clip" }, shot(p)),
      el("div", { class: "tile", "aria-hidden": "true" }, initial(text(p, "title"))),
    ),
    el(
      "div",
      { class: "sheet-content" },
      el("span", { class: "cat" }, t.cats[p.category]),
      el("h2", { id: "sheet-title" }, text(p, "title")),
      text(p, "tagline") && el("p", { class: "tagline" }, text(p, "tagline")),
      text(p, "about") && [el("h4", {}, t.what), el("p", { class: "about" }, text(p, "about"))],
      p.tech.length > 0 && [el("h4", {}, t.tech), chips(p.tech)],
      languageBlock(p.languages),
      el("h4", {}, t.glance),
      el(
        "dl",
        { class: "facts" },
        el("div", {}, el("dt", {}, t.created), el("dd", {}, monthYear(p.created))),
        el("div", {}, el("dt", {}, t.lastUpdate), el("dd", {}, since(p.pushed))),
        p.fork && el("div", {}, el("dt", {}, t.origin), el("dd", {}, t.forkOf)),
        el("div", {}, el("dt", {}, t.repo), el("dd", {}, p.name)),
      ),
      el(
        "div",
        { class: "sheet-actions" },
        el("a", { class: "btn solid", href: p.url }, t.github),
        p.site && el("a", { class: "btn", href: p.site }, t.site),
      ),
    ),
  );
}

function showSheet(p, instant) {
  current = p;
  history.replaceState(null, "", `#${p.name}`); // shareable link to this sheet
  $("sheet-body").replaceChildren(sheetContent(p));
  panel.scrollTop = 0;
  panel.style.transition = panel.style.transform = "";
  sheet.showModal();
  document.body.classList.add("locked");
  if (instant) {
    sheet.classList.add("instant", "open");
    requestAnimationFrame(() => sheet.classList.remove("instant"));
  } else {
    // next frame, so the panel animates in from its closed position
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add("open")));
  }
}

function hideSheetNow() {
  sheet.classList.add("instant");
  sheet.classList.remove("open");
  sheet.close();
  sheet.classList.remove("instant");
  document.body.classList.remove("locked");
  panel.style.transition = panel.style.transform = "";
  current = null;
}

function onScreen(node) {
  if (!node?.isConnected) return false;
  const box = node.getBoundingClientRect();
  return box.bottom > 0 && box.top < innerHeight && box.width > 0;
}

/** Opens the info sheet; with a source card, the card grows into the sheet. */
function openSheet(p, from) {
  source = from || null;
  if (!canAnimate() || !onScreen(source)) return showSheet(p, false);
  const name = source.style.viewTransitionName;
  source.style.viewTransitionName = "morph";
  const transition = document.startViewTransition(() => {
    source.style.viewTransitionName = name;
    panel.style.viewTransitionName = "morph";
    showSheet(p, true);
  });
  transition.finished.finally(() => (panel.style.viewTransitionName = ""));
}

let closing = null;

/** Closes the sheet: back into its card when that card is on screen, otherwise it slides away. */
function closeSheet({ morph = true } = {}) {
  if (!sheet.open || closing) return;
  history.replaceState(null, "", location.pathname + location.search);
  if (morph && canAnimate() && onScreen(source)) {
    const target = source;
    const name = target.style.viewTransitionName;
    panel.style.viewTransitionName = "morph";
    const transition = document.startViewTransition(() => {
      panel.style.viewTransitionName = "";
      hideSheetNow();
      target.style.viewTransitionName = "morph";
    });
    transition.finished.finally(() => (target.style.viewTransitionName = name));
    return;
  }
  sheet.classList.remove("open");
  if (MOBILE.matches) {
    // continue from wherever a drag left the panel
    panel.style.transition = "";
    panel.style.transform = "translateY(100%)";
  }
  closing = setTimeout(() => {
    hideSheetNow();
    closing = null;
  }, REDUCED.matches ? 200 : 380);
}

$("sheet-close").addEventListener("click", () => closeSheet());
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
  if (dy + project(velocity) > panel.offsetHeight * 0.4) closeSheet({ morph: false });
  else panel.style.transform = ""; // springs back from where the finger let go
}

panel.addEventListener("pointerup", endDrag);
panel.addEventListener("pointercancel", endDrag);

// ---------- language ----------

function applyStaticTexts() {
  document.documentElement.lang = lang;
  for (const node of document.querySelectorAll("[data-i18n]")) node.textContent = t[node.dataset.i18n];
  $("filters").setAttribute("aria-label", t.filterLabel);
  $("sheet-close").setAttribute("aria-label", t.close);
  for (const button of document.querySelectorAll("[data-lang]")) button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  if (data) document.title = t.title(data.name);
}

function setLang(next) {
  if (next === lang) return;
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch {}
  const update = () => {
    lang = next;
    t = I18N[lang];
    applyStaticTexts();
    if (data) render();
    if (current) $("sheet-body").replaceChildren(sheetContent(current));
  };
  if (canAnimate()) document.startViewTransition(update);
  else update();
}

for (const button of document.querySelectorAll("[data-lang]")) button.addEventListener("click", () => setLang(button.dataset.lang));

// ---------- page ----------

function render() {
  projects = data.projects;
  $("name").textContent = data.name;
  $("bar-name").textContent = data.name;
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

  renderSkills();

  const featured = projects.filter((p) => p.featured);
  if (featured.length) {
    $("featured").replaceChildren(...featured.map(featuredCard));
    $("featured-block").hidden = false;
  }

  renderFilters();
  renderGrid();
}

async function load() {
  try {
    const response = await fetch("repos.json", { cache: "no-cache" });
    data = await response.json();
    document.title = t.title(data.name);
    render();
    const linked = projects.find((p) => `#${p.name}` === decodeURIComponent(location.hash));
    if (linked) openSheet(linked);
  } catch {
    $("empty").textContent = t.error;
  }
}

// The bar gets its hairline and title only once the big name has scrolled away.
const bar = document.querySelector(".bar");
new IntersectionObserver(([entry]) => bar.classList.toggle("scrolled", !entry.isIntersecting), {
  rootMargin: "-52px 0px 0px 0px",
}).observe($("name"));

applyStaticTexts();
$("empty").textContent = t.loading;
load();
