let data = [];
let currentTurn = 0;


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

function updateURL() {
    const state = { chars: data, turn: currentTurn };
    const encoded = btoa(JSON.stringify(state));
    const newUrl = `${location.origin}${location.pathname}?state=${encoded}`;
    prompt("Copy this URL to share:", newUrl);
}

function sortByInitiative() {
    data.sort((a, b) => b.init - a.init);
    currentTurn = 0;
    renderView();
}