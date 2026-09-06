const CDN = "https://flagcdn.com";
const fallbackFlags = { us: "United States", ca: "Canada", mx: "Mexico", br: "Brazil", ar: "Argentina", gb: "United Kingdom", fr: "France", de: "Germany", it: "Italy", es: "Spain", pt: "Portugal", ie: "Ireland", no: "Norway", se: "Sweden", fi: "Finland", pl: "Poland", ua: "Ukraine", gr: "Greece", tr: "Turkey", eg: "Egypt", za: "South Africa", ng: "Nigeria", ke: "Kenya", in: "India", cn: "China", jp: "Japan", kr: "South Korea", au: "Australia", nz: "New Zealand", fj: "Fiji" };
let flags = [];
let exploreIndex = 0;
let question = 0, streak = 0, answerLocked = false;
let score = Number(localStorage.getItem("flagfun-score") || 0);

const $ = (id) => document.getElementById(id);
const flagUrl = (code, width = 320) => `${CDN}/w${width}/${code}.png`;
const shuffled = (items) => [...items].sort(() => Math.random() - .5);

function persistScore() { localStorage.setItem("flagfun-score", score); $("quizScore").textContent = score; $("scoreBadge").textContent = `${score} pts`; }
function updateClock() { $("clock").textContent = new Intl.DateTimeFormat(undefined, { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"2-digit" }).format(new Date()); }
function displayFlag(flag, image, name, code) { image.src = flagUrl(flag.code); image.alt = `Flag of ${flag.name}`; name.textContent = flag.name; code.textContent = flag.code.toUpperCase(); }
function renderFeature() { const flag = flags[exploreIndex]; displayFlag(flag, $("exploreFlag"), $("exploreName"), $("exploreCode")); }
function showFlag(code) { exploreIndex = Math.max(0, flags.findIndex((flag) => flag.code === code)); renderFeature(); document.querySelector(".feature-card").scrollIntoView({ behavior:"smooth", block:"center" }); }
function renderGrid(list = flags) { const limited = list.slice(0, 60); $("flagGrid").innerHTML = limited.map((flag) => `<button class="flag-tile" type="button" data-code="${flag.code}"><img src="${flagUrl(flag.code, 160)}" alt="Flag of ${flag.name}" loading="lazy"><strong>${flag.name}</strong><small>${flag.code}</small></button>`).join(""); $("collectionNote").textContent = list.length === flags.length ? `Browse ${flags.length} country and territory flags. Select one to see it up close.` : `${list.length} match${list.length === 1 ? "" : "es"} found.`; }
function newQuestion() { answerLocked = false; question++; const answer = flags[Math.floor(Math.random() * flags.length)]; const options = shuffled([answer, ...shuffled(flags.filter((flag) => flag.code !== answer.code)).slice(0, 3)]); $("questionNumber").textContent = `Question ${question}`; $("streak").textContent = `${streak} streak`; $("quizFlag").src = flagUrl(answer.code); $("quizFlag").dataset.answer = answer.code; $("quizFlag").alt = "Which flag is this?"; $("quizFeedback").textContent = ""; $("nextQuestion").hidden = true; $("answers").innerHTML = options.map((flag) => `<button type="button" class="answer" data-code="${flag.code}">${flag.name}</button>`).join(""); }
function answerQuiz(button) { if (answerLocked) return; answerLocked = true; const correct = $("quizFlag").dataset.answer; const right = button.dataset.code === correct; document.querySelectorAll(".answer").forEach((item) => { item.disabled = true; if (item.dataset.code === correct) item.classList.add("correct"); }); if (right) { score += 10; streak++; button.classList.add("correct"); $("quizFeedback").textContent = `Correct! ${flags.find((f) => f.code === correct).name} earns you 10 points.`; } else { streak = 0; button.classList.add("wrong"); $("quizFeedback").textContent = `Not quite — that is ${flags.find((f) => f.code === correct).name}.`; } persistScore(); $("streak").textContent = `${streak} streak`; $("nextQuestion").hidden = false; }
function localSundayStart() { const now = new Date(); const start = new Date(now); start.setHours(0,0,0,0); start.setDate(start.getDate() - start.getDay()); return start; }
function weeklyFlag() { const start = localSundayStart(); const seed = Math.floor(start.getTime() / 604800000); return flags[Math.abs(seed) % flags.length]; }
function renderWeekly() { const flag = weeklyFlag(); displayFlag(flag, $("weeklyFlag"), $("weeklyName"), $("weeklyCode")); const end = new Date(localSundayStart()); end.setDate(end.getDate() + 7); const diff = end - new Date(), d = Math.floor(diff / 86400000), h = Math.floor(diff / 3600000) % 24, m = Math.floor(diff / 60000) % 60; $("weeklyCountdown").textContent = `New flag in ${d}d ${h}h ${m}m`; const format = new Intl.DateTimeFormat(undefined, { month:"short", day:"numeric" }); $("weekTag").textContent = `WEEK OF ${format.format(localSundayStart()).toUpperCase()}`; }
function setTab(target) { document.querySelectorAll(".tab").forEach((tab) => { const on = tab.dataset.tab === target; tab.classList.toggle("active", on); tab.setAttribute("aria-selected", on); }); document.querySelectorAll(".panel").forEach((panel) => { const on = panel.id === target; panel.classList.toggle("active", on); panel.hidden = !on; }); location.hash = target; }
function applyTheme(theme) { document.documentElement.dataset.theme = theme; $("themeToggle").textContent = theme === "dark" ? "☀" : "☾"; localStorage.setItem("flagfun-theme", theme); }

async function loadFlags() { try { const response = await fetch(`${CDN}/en/codes.json`); if (!response.ok) throw new Error("Flag list unavailable"); const data = await response.json(); flags = Object.entries(data).map(([code, name]) => ({ code, name })).filter((flag) => flag.code !== "xx"); } catch { flags = Object.entries(fallbackFlags).map(([code, name]) => ({ code, name })); }
  flags.sort((a,b) => a.name.localeCompare(b.name)); exploreIndex = new Date().getDate() % flags.length; renderFeature(); renderGrid(); renderWeekly(); newQuestion(); }

document.addEventListener("click", (event) => { const tab = event.target.closest(".tab"); if (tab) setTab(tab.dataset.tab); const tile = event.target.closest(".flag-tile"); if (tile) showFlag(tile.dataset.code); const answer = event.target.closest(".answer"); if (answer) answerQuiz(answer); });
$("previousFlag").addEventListener("click", () => { exploreIndex = (exploreIndex - 1 + flags.length) % flags.length; renderFeature(); });
$("nextFlag").addEventListener("click", () => { exploreIndex = (exploreIndex + 1) % flags.length; renderFeature(); });
$("randomFlag").addEventListener("click", () => { exploreIndex = Math.floor(Math.random() * flags.length); renderFeature(); });
$("flagSearch").addEventListener("input", (event) => renderGrid(flags.filter((flag) => flag.name.toLowerCase().includes(event.target.value.trim().toLowerCase()))));
$("nextQuestion").addEventListener("click", newQuestion);
$("resetScore").addEventListener("click", () => { score = 0; streak = 0; persistScore(); newQuestion(); });
$("themeToggle").addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
$("shareWeekly").addEventListener("click", async () => { const flag = weeklyFlag(); const text = `This week's FlagFun pick: ${flag.name} ${flagUrl(flag.code)}`; try { await navigator.clipboard.writeText(text); $("shareWeekly").innerHTML = "Copied to clipboard <span>✓</span>"; } catch { $("shareWeekly").textContent = text; } });

applyTheme(localStorage.getItem("flagfun-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")); persistScore(); updateClock(); setInterval(updateClock, 1000); setInterval(renderWeekly, 60000); loadFlags();
const initial = location.hash.slice(1); if (["explore", "quiz", "weekly"].includes(initial)) setTab(initial);
