let blockData = [];
const colors = {
    'maple' : '#D9BC9A',
    'oak' : '#BF8563',
    'walnut' : '#40221B',
}

let alternating = true;

document.addEventListener('DOMContentLoaded', (event) => {
    let totalLengthInputEl = document.getElementById('totalLengthInput');
    let totalLengthEl = document.getElementById('totalLength');
    let cuttingBoardContainerEl = document.getElementById('cuttingBoard');
    let blockInputContainerEl = document.getElementById('blockInputs');

    console.log(blockInputContainerEl);

    addBlock(blockInputContainerEl, 90, 'walnut');
    addBlock(blockInputContainerEl, 40, 'oak');
    addBlock(blockInputContainerEl, 70, 'maple');
    addBlock(blockInputContainerEl, 30, 'oak');

    makeColumns (totalLengthInputEl, totalLengthEl, cuttingBoardContainerEl)
    totalLengthInput.addEventListener('input', () => {
        makeColumns (totalLengthInputEl, totalLengthEl, cuttingBoardContainerEl)
    });

    let totalWidthInput = document.getElementById('totalWidthInput');
    let totalWidthEl = document.getElementById('totalWidth');
    totalWidthEl.innerText = totalWidthInput.value;

    totalWidthInput.addEventListener('input', () => {
        totalWidthEl.innerText = totalWidthInput.value;
    });

    let totalHeightInput = document.getElementById('totalHeightInput');
    let totalHeightEl = document.getElementById('totalHeight');
    totalHeightEl.innerText = totalHeightInput.value;

    totalHeightInput.addEventListener('input', () => {
        totalHeightEl.innerText = totalHeightInput.value;
    });


});

let makeColumns = (totalLengthInputEl, totalLengthEl, cuttingBoardContainerEl) => {
    totalLengthEl.innerText = totalLengthInputEl.value;
    // create columns
    let columnCount = totalLengthInputEl.value / totalLengthInputEl.step;
    cuttingBoardContainerEl.innerHTML = "";
    for (let column = 0; column < columnCount; column++) {
        let col = document.createElement('div');
        col.classList.add('block__column');
        for (let row = 0; row < blockData.length; row++) {
            if (alternating == true && column % 2 !== 0)
            {
                index = blockData.length -1 - row;
            }
            else {
                index = row;
            }
            let block = document.createElement('div');
            block.style.width = `${totalLengthInputEl.step}px`;
            block.style.height = `${blockData[index].length}px`;
            block.style.backgroundColor = blockData[index].color;
            block.classList.add('block__row');
            col.appendChild(block);
        }
        cuttingBoardContainerEl.appendChild(col);
    }
}

let addBlock = (blockInputContainerEl, length, woodType) => {
    let block = document.createElement('div');
    block.classList.add(`container__block-definition-${blockData.length}`);
    block.innerHTML = `        
        <div class="input-group input-group__block--height">
            <input type="range" min="20" max="100" value="${length}" step="5" id="blockLengthInput${blockData.length}" class="input-group__input">
            <label for="blockLengthInput${blockData.length}" class="input-group__label">Länge: <span id="blockLength${blockData.length}">${length}</span> mm</label>
        </div>
        <div class="input-group input-group__block--wood">
            <select name="wood${blockData.length}" id="woodInput${blockData.length}">
                <option value="oak" ${woodType == 'oak' ? 'selected': ''}>Eiche</option>
                <option value="walnut" ${woodType == 'walnut' ? 'selected': ''}>Nussbaum</option>
                <option value="maple" ${woodType == 'maple' ? 'selected': ''}>Ahorn</option>
            </select>
        </div>
    `;
    blockData.push({length, color:colors[woodType]});
    blockInputContainerEl.appendChild(block);

    console.log(block.childNodes[1].childNodes[1])

    block.childNodes[1].childNodes[1].addEventListener('input', () => {
        block.childNodes[1].childNodes[3].childNodes[1].innerText = block.childNodes[1].childNodes[1].value;
    });
}