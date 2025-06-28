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
    nameCell.innerHTML = `<input name="name-${index}" aria-label="Name" value="${char.name || ""}" onchange="updateName(this, ${index})" />`;
    baseInitCell.innerHTML = numberControlHTML(char.baseInit || 0, "baseInit", index);
    initCell.innerHTML = numberControlHTML(char.init || 0, "init", index);
    hpCell.innerHTML = numberControlHTML(char.hp || 0, "hp", index);
    acCell.innerHTML = numberControlHTML(char.ac || 0, "ac", index);
    removeCell.innerHTML = `<button onclick="removeCharacter(${index})">❌</button>`;

    if (index === currentTurn) {
        row.classList.add("current-turn");
    }
}

function renderCards() {
    const cardView = document.getElementById("card-view");
    cardView.innerHTML = "";

    data.forEach((char, index) => {
        const card = document.createElement("div");
        card.className = "card" + (index === currentTurn ? " current-turn" : "");
        card.innerHTML = `
            <input type="text" value="${char.name || ""}" onchange="updateName(this, ${index})" name="name-${index}" aria-label="Name" />
            <div>Base Init: ${numberControlHTML(char.baseInit || 0, "baseInit", index)}</div>
            <div>Init: ${numberControlHTML(char.init || 0, "init", index)}</div>
            <div>HP: ${numberControlHTML(char.hp || 0, "hp", index)}</div>
            <div>AC: ${numberControlHTML(char.ac || 0, "ac", index)}</div>
            <div style="margin-top: 8px;">
              <button onclick="removeCharacter(${index})">❌ Delete</button>
            </div>
        `;
        cardView.appendChild(card);
    });
}