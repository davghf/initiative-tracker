window.onload = () => {
    applySavedTheme();
    loadFromURL();
    window.addEventListener("resize", renderView);
};

document.addEventListener("keydown", e => {
    if (e.key === "n" || e.key === "N") {
        nextTurn();
    }
});