import { PHASES } from "./data.js";

const STORAGE_KEY = "checklist-growth-progress";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage indisponível (ex: modo privado) — segue sem persistir
  }
}

function allKeys() {
  const keys = [];
  PHASES.forEach((phase, pi) => {
    phase.groups.forEach((group, gi) => {
      group.items.forEach((_, ii) => keys.push(`${pi}-${gi}-${ii}`));
    });
  });
  return keys;
}

const ALL_KEYS = allKeys();
let state = loadState();

const app = document.getElementById("app");

app.innerHTML = `
  <div class="wrap">
    <div class="head">
      <p class="eyebrow">Plano de estudo</p>
      <h1>Fundamentos de oferta, tráfego e copy</h1>
      <p class="sub">Seis fases, uma por semana. Marque conforme avança — o progresso fica salvo neste navegador.</p>
    </div>

    <div class="overall">
      <div class="ring">
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle class="ring-track" cx="28" cy="28" r="24"></circle>
          <circle class="ring-fill" id="ring-fill" cx="28" cy="28" r="24" stroke-dasharray="150.8" stroke-dashoffset="150.8"></circle>
        </svg>
        <div class="ring-num" id="ring-num">0%</div>
      </div>
      <div class="overall-txt">
        <p class="t1" id="overall-t1">0 de 0 itens concluídos</p>
        <p class="t2">Progresso geral do checklist</p>
      </div>
      <button class="reset-btn" id="reset-btn">Reiniciar</button>
    </div>

    <div id="phases"></div>

    <p class="foot">Progresso salvo localmente neste navegador — para acessar de outro dispositivo, use a mesma URL no mesmo navegador.</p>
  </div>
`;

const phasesEl = document.getElementById("phases");
const openPhases = new Set();

function render() {
  phasesEl.innerHTML = "";

  PHASES.forEach((phase, pi) => {
    const phaseKeys = [];
    phase.groups.forEach((g, gi) => g.items.forEach((_, ii) => phaseKeys.push(`${pi}-${gi}-${ii}`)));
    const doneCount = phaseKeys.filter((k) => state[k]).length;
    const total = phaseKeys.length;
    const isComplete = total > 0 && doneCount === total;
    const isOpen = openPhases.has(pi);

    const phaseEl = document.createElement("div");
    phaseEl.className = `phase${isComplete ? " complete" : ""}${isOpen ? " open" : ""}`;

    const head = document.createElement("div");
    head.className = "phase-head";
    head.innerHTML = `
      <div class="phase-num">${isComplete ? "&#10003;" : pi + 1}</div>
      <div class="phase-title">
        <p class="name">${phase.name}</p>
        <p class="when">${phase.when}</p>
      </div>
      <div class="phase-count">${doneCount}/${total}</div>
      <div class="chev">&#9660;</div>
    `;
    head.addEventListener("click", () => {
      if (openPhases.has(pi)) openPhases.delete(pi);
      else openPhases.add(pi);
      render();
    });

    const bar = document.createElement("div");
    bar.className = "phase-bar";
    bar.innerHTML = `<div class="phase-bar-fill" style="width:${total ? (doneCount / total) * 100 : 0}%"></div>`;

    const body = document.createElement("div");
    body.className = "phase-body";
    const inner = document.createElement("div");
    inner.className = "phase-inner";

    phase.groups.forEach((group, gi) => {
      const label = document.createElement("p");
      label.className = "group-label";
      label.textContent = group.label;
      inner.appendChild(label);

      group.items.forEach((text, ii) => {
        const key = `${pi}-${gi}-${ii}`;
        const row = document.createElement("div");
        row.className = `item${state[key] ? " checked" : ""}`;
        const cbId = `cb-${key}`;
        row.innerHTML = `
          <input type="checkbox" id="${cbId}" ${state[key] ? "checked" : ""}>
          <label for="${cbId}">${text}</label>
        `;
        row.querySelector("input").addEventListener("change", (e) => {
          state[key] = e.target.checked;
          saveState(state);
          render();
        });
        inner.appendChild(row);
      });
    });

    body.appendChild(inner);
    phaseEl.appendChild(head);
    phaseEl.appendChild(bar);
    phaseEl.appendChild(body);
    phasesEl.appendChild(phaseEl);
  });

  updateOverall();
}

function updateOverall() {
  const doneCount = ALL_KEYS.filter((k) => state[k]).length;
  const total = ALL_KEYS.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  document.getElementById("overall-t1").textContent = `${doneCount} de ${total} itens concluídos`;
  document.getElementById("ring-num").textContent = `${pct}%`;
  const circ = 150.8;
  const offset = circ - (circ * pct) / 100;
  document.getElementById("ring-fill").style.strokeDashoffset = offset;
}

document.getElementById("reset-btn").addEventListener("click", () => {
  if (!confirm("Reiniciar todo o progresso?")) return;
  state = {};
  saveState(state);
  render();
});

// abre a primeira fase que ainda tem itens pendentes
const firstPending = PHASES.findIndex((phase, pi) => {
  const keys = [];
  phase.groups.forEach((g, gi) => g.items.forEach((_, ii) => keys.push(`${pi}-${gi}-${ii}`)));
  return keys.some((k) => !state[k]);
});
openPhases.add(firstPending >= 0 ? firstPending : 0);

render();
