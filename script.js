let data = [];
let currentTurn = 0;

function numberControlHTML(value, field) {
  return `
    <div class="num-control" data-field="${field}">
      <button onclick="changeNumber(this, -1)">−</button>
      <input type="number" value="${value}" onchange="saveState()" />
      <button onclick="changeNumber(this, 1)">+</button>
    </div>
  `;
}

function changeNumber(btn, delta) {
  const container = btn.parentElement;
  const input = container.querySelector("input");
  input.value = parseInt(input.value || "0") + delta;
  saveState();
}

function addRow(char = {}) {
  const table = document.querySelector("#tracker tbody");
  const row = table.insertRow();

  const idCell = row.insertCell();
  const nameCell = row.insertCell();
  const baseInitCell = row.insertCell();
  const initCell = row.insertCell();
  const hpCell = row.insertCell();
  const acCell = row.insertCell();
  const removeCell = row.insertCell();

  row.dataset.index = table.rows.length - 1;

  idCell.textContent = table.rows.length;

  nameCell.innerHTML = `<input value="${char.name || ""}" onchange="saveState()" />`;
  baseInitCell.innerHTML = numberControlHTML(char.baseInit || 0, "baseInit");
  initCell.innerHTML = numberControlHTML(char.init || 0, "init");
  hpCell.innerHTML = numberControlHTML(char.hp || 0, "hp");
  acCell.innerHTML = numberControlHTML(char.ac || 0, "ac");

  removeCell.innerHTML = `<button onclick="removeRow(this)">❌</button>`;

  saveState();
}

function removeRow(btn) {
  const row = btn.closest("tr");
  row.remove();
  saveState();
}

function rollAllInitiatives() {
  const rows = document.querySelectorAll("#tracker tbody tr");
  rows.forEach((row) => {
    const base = parseInt(row.cells[2].querySelector("input").value) || 0;
    const roll = base + Math.floor(Math.random() * 20) + 1;
    row.cells[3].querySelector("input").value = roll;
  });
  saveState();
}

function nextTurn() {
  const rows = document.querySelectorAll("#tracker tbody tr");
  rows.forEach(r => r.classList.remove("current-turn"));

  if (rows.length === 0) return;

  currentTurn = (currentTurn + 1) % rows.length;
  rows[currentTurn].classList.add("current-turn");
}

function saveState() {
  const rows = document.querySelectorAll("#tracker tbody tr");
  data = Array.from(rows).map(row => ({
    name: row.cells[1].querySelector("input").value,
    baseInit: +row.cells[2].querySelector("input").value,
    init: +row.cells[3].querySelector("input").value,
    hp: +row.cells[4].querySelector("input").value,
    ac: +row.cells[5].querySelector("input").value,
  }));
}

function updateURL() {
  saveState();
  const state = {
    chars: data,
    turn: currentTurn
  };
  const encoded = btoa(JSON.stringify(state));
  const newUrl = `${location.origin}${location.pathname}?state=${encoded}`;
  prompt("Copy this URL to share:", newUrl);
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("state")) {
    try {
      const state = JSON.parse(atob(params.get("state")));
      data = state.chars || [];
      currentTurn = state.turn || 0;

      document.querySelector("#tracker tbody").innerHTML = "";
      data.forEach(addRow);

      // Set the current turn row
      const rows = document.querySelectorAll("#tracker tbody tr");
      if (rows[currentTurn]) {
        rows[currentTurn].classList.add("current-turn");
      }
    } catch (e) {
      console.error("Invalid state in URL");
    }
  }
}

function sortByInitiative() {
  saveState();

  // Sort data array by initiative descending
  data.sort((a, b) => b.init - a.init);

  // Re-render table
  const tbody = document.querySelector("#tracker tbody");
  tbody.innerHTML = "";
  data.forEach(addRow);

  currentTurn = 0;
  const rows = document.querySelectorAll("#tracker tbody tr");
  if (rows.length > 0) {
    rows[0].classList.add("current-turn");
  }
}

function toggleTheme() {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

function applySavedTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light");
  }
}

window.onload = () => {
  applySavedTheme();
  loadFromURL();
};

window.onload = loadFromURL;
