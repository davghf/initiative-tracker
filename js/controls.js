function addNewCharacter() {
    console.log("addding new character")
    data.push({ name: "", baseInit: 0, init: 0, hp: 0, ac: 0 });
    renderView();
}

function removeCharacter(index) {
    data.splice(index, 1);
    if (currentTurn >= data.length) 
        currentTurn = 0;
    renderView();
}

function rollAllInitiatives() {
    data = data.map(char => ({
        ...char,
        init: char.baseInit + Math.floor(Math.random() * 20) + 1
    }));
    renderView();
}

function nextTurn() {
    if (data.length === 0) 
        return;
    currentTurn = (currentTurn + 1) % data.length;
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