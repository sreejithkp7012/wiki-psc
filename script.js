const subjects = [
  ["ഇന്ത്യൻ ചരിത്രം", "🏛️"],
  ["കേരള ചരിത്രം", "🌴"],
  ["ഭരണഘടന", "⚖️"],
  ["ഇന്ത്യൻ ഭൂമിശാസ്ത്രം", "🗺️"],
  ["കേരള ഭൂമിശാസ്ത്രം", "📍"],
  ["Economics", "💹"],
  ["ബയോളജി", "🧬"],
  ["കെമിസ്ട്രി", "⚗️"],
  ["ഫിസിക്സ്", "⚛️"],
  ["ആനുകാലികം", "📰"],
  ["മലയാളം", "🔤"],
  ["English", "📖"]
];

const KEY = "wikiPSC_completed";
const saved = JSON.parse(localStorage.getItem(KEY) || "[]");

function isDone(i) { return saved.includes(i); }

function renderSubjects() {
  const grid = document.getElementById("subjectGrid");
  grid.innerHTML = subjects.map((s, i) => `
    <article class="subject-card ${isDone(i) ? "done" : ""}">
      <div class="subject-icon">${s[1]}</div>
      <h3>${s[0]}</h3>
      <small>${isDone(i) ? "പൂർത്തിയായി ✓" : "പഠിക്കാൻ തയ്യാറാണ്"}</small>
      <div class="done-mark">✓</div>
    </article>
  `).join("");
}

function renderChecklist() {
  const list = document.getElementById("checklist");
  list.innerHTML = subjects.map((s, i) => `
    <label class="check-item">
      <input type="checkbox" data-index="${i}" ${isDone(i) ? "checked" : ""}>
      <span>${s[0]}</span>
    </label>
  `).join("");

  list.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", () => {
      const i = Number(input.dataset.index);
      if (input.checked && !saved.includes(i)) saved.push(i);
      if (!input.checked) {
        const pos = saved.indexOf(i);
        if (pos !== -1) saved.splice(pos, 1);
      }
      localStorage.setItem(KEY, JSON.stringify(saved));
      updateProgress();
      renderSubjects();
    });
  });
}

function updateProgress() {
  const done = saved.length;
  const total = subjects.length;
  const percent = Math.round((done / total) * 100);
  document.getElementById("progressBar").style.width = `${percent}%`;
  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("completedCount").textContent = done;
  document.getElementById("totalCount").textContent = total;
  document.getElementById("subjectBadge").textContent = `${done} / ${total}`;
}

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("എല്ലാ completed subjects-ഉം reset ചെയ്യണോ?")) {
    saved.length = 0;
    localStorage.removeItem(KEY);
    renderChecklist();
    renderSubjects();
    updateProgress();
  }
});

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.getElementById("themeBtn").textContent =
    document.body.classList.contains("dark") ? "☀" : "☾";
  localStorage.setItem("wikiPSC_theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("wikiPSC_theme") === "dark") {
  document.body.classList.add("dark");
  document.getElementById("themeBtn").textContent = "☀";
}

renderSubjects();
renderChecklist();
updateProgress();
