
let data = [];
let currentTurn = 0;

function renderView() {
    const isMobile = window.innerWidth <= 900;
    document.getElementById("table-view").style.display = isMobile ? "none" : "block";
    document.getElementById("card-view").style.display = isMobile ? "block" : "none";

    if (isMobile) {
        renderCards();
    } else {
        const tbody = document.querySelector("#tracker tbody");
        tbody.innerHTML = "";
        data.forEach((char, index) => addRow(char, index));
    }
}

function renderCards() {
    const cardView = document.getElementById("card-view");
    cardView.innerHTML = "";

    data.forEach((char, index) => {
        const card = document.createElement("div");
        card.className = "card" + (index === currentTurn ? " current-turn" : "");
        card.innerHTML = `
            <strong>${char.name || "Unnamed"}</strong>
            <div>Base Init: ${numberControlHTML(char.baseInit || 0, "baseInit", index)}</div>
            <div>Init: ${numberControlHTML(char.init || 0, "init", index)}</div>
            <div>HP: ${numberControlHTML(char.hp || 0, "hp", index)}</div>
            <div>AC: ${numberControlHTML(char.ac || 0, "ac", index)}</div>
        `;
        cardView.appendChild(card);
    });
}

function numberControlHTML(value, field, index = null) {
    return `
        <div class="num-control" data-field="${field}" ${index !== null ? `data-index="${index}"` : ""}>
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

    const index = container.getAttribute("data-index");
    const field = container.getAttribute("data-field");
    if (index !== null) {
        data[+index][field] = +input.value;
    }

    saveState();
    renderView(); // update both views
}

function addRow(char = {}, index = null) {
    const table = document.querySelector("#tracker tbody");
    const row = table.insertRow();

    row.dataset.index = index;

    const idCell = row.insertCell();
    const nameCell = row.insertCell();
    const baseInitCell = row.insertCell();
    const initCell = row.insertCell();
    const hpCell = row.insertCell();
    const acCell = row.insertCell();
    const removeCell = row.insertCell();

    idCell.textContent = index + 1;

    nameCell.innerHTML = `<input value="${char.name || ""}" onchange="saveState()" />`;
    baseInitCell.innerHTML = numberControlHTML(char.baseInit || 0, "baseInit", index);
    initCell.innerHTML = numberControlHTML(char.init || 0, "init", index);
    hpCell.innerHTML = numberControlHTML(char.hp || 0, "hp", index);
    acCell.innerHTML = numberControlHTML(char.ac || 0, "ac", index);
    removeCell.innerHTML = `<button onclick="removeCharacter(${index})">❌</button>`;

    if (index === currentTurn) {
        row.classList.add("current-turn");
    }
}

function addNewCharacter() {
    data.push({ name: "", baseInit: 0, init: 0, hp: 0, ac: 0 });
    saveState();
    renderView();
}

function removeCharacter(index) {
    data.splice(index, 1);
    if (currentTurn >= data.length) currentTurn = 0;
    saveState();
    renderView();
}

function rollAllInitiatives() {
    data = data.map(char => ({
        ...char,
        init: char.baseInit + Math.floor(Math.random() * 20) + 1
    }));
    saveState();
    renderView();
}

function nextTurn() {
    if (data.length === 0) return;
    currentTurn = (currentTurn + 1) % data.length;
    renderView();
}

function saveState() {
    const rows = document.querySelectorAll("#tracker tbody tr");
    if (rows.length > 0) {
        data = Array.from(rows).map(row => ({
            name: row.cells[1].querySelector("input").value,
            baseInit: +row.cells[2].querySelector("input").value,
            init: +row.cells[3].querySelector("input").value,
            hp: +row.cells[4].querySelector("input").value,
            ac: +row.cells[5].querySelector("input").value,
        }));
    }
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
        } catch (e) {
            console.error("Invalid state in URL");
        }
    }
    renderView();
}

function sortByInitiative() {
    saveState();
    data.sort((a, b) => b.init - a.init);
    currentTurn = 0;
    renderView();
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

document.addEventListener("keydown", e => {
    if (e.key === "n" || e.key === "N") {
        nextTurn();
    }
});

window.onload = () => {
    applySavedTheme();
    loadFromURL();
    window.addEventListener("resize", renderView);
};
