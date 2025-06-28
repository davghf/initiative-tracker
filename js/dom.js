function numberControlHTML(value, field, index = null) {
    const nameAttr = index !== null ? `name="${field}-${index}"` : `name="${field}"`;
    const ariaLabel = `aria-label="${field.charAt(0).toUpperCase() + field.slice(1)}"`;

    return `
        <div class="num-control" data-field="${field}" ${index !== null ? `data-index="${index}"` : ""}>
            <button type="button" tabindex="-1" onmousedown="changeNumber(this, -1); event.preventDefault();">−</button>
            <input type="number" ${nameAttr} ${ariaLabel} value="${value}" onchange="handleInputChange(this)" />
            <button type="button" tabindex="-1" onmousedown="changeNumber(this, 1); event.preventDefault();">+</button>
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

    renderView();
}

function handleInputChange(input) {
    const container = input.parentElement;
    const index = container.getAttribute("data-index");
    const field = container.getAttribute("data-field");
    if (index !== null && field) {
        data[+index][field] = +input.value;
    }
}

function updateName(input, index) {
    data[index].name = input.value;
}