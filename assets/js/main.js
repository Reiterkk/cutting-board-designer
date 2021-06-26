let buildingBlocks = [];
let totalHeight = 40;
let totalWidth = 0;
let totalLength = 0;
const blockWidth = 40;
// let columnCount = 0;
const maxBlocks = 7;
const minBlocks = 3;
const maxBlockLength = 100;
const minBlockLength = 20;
const blockLengthStep = 5;
let blockID = 0;

const colors = {
  maple: "#D9BC9A",
  oak: "#BF8563",
  walnut: "#40221B",
};
const woodTypes = ["maple", "oak", "walnut"];

let alternating = true;

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const hide = (selector) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.classList.add("hidden");
  });
};

const show = (selector) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.classList.remove("hidden");
  });
};

const setRangeValue = (blockInputContainerEl, startIndex, difference) => {
  let index;
  let rangeInputSlider;
  let rangeInputLabel;
  let oldValue;
  let newValue;
  let indexOffset = startIndex;
  do {
    index = indexOffset++ % buildingBlocks.length;
    rangeInputSlider = blockInputContainerEl.children[index].querySelector(
      ".input-group__input-range"
    );
    rangeInputLabel = blockInputContainerEl.children[index].querySelector(
      ".input-group__label > span"
    );
    oldValue = parseInt(rangeInputSlider.value);
    newValue = oldValue + difference;
  } while (newValue < minBlockLength || newValue > maxBlockLength);
  rangeInputSlider.value = newValue;
  rangeInputLabel.innerText = newValue;
  buildingBlocks[index].length = newValue;
  return index;
};

document.addEventListener("DOMContentLoaded", (event) => {
  let totalLengthInputEl = document.getElementById("totalLengthInput");
  let totalLengthEl = document.getElementById("totalLength");
  totalLength = totalLengthInputEl.value;
  // let cuttingBoardContainerEl = document.getElementById('cuttingBoard');
  let blockInputContainerEl = document.getElementById("blockInputContainer");

  console.log(blockInputContainerEl);

  addBlock(blockInputContainerEl, 90, "walnut", buildingBlocks.length);
  addBlock(blockInputContainerEl, 40, "oak", buildingBlocks.length);
  addBlock(blockInputContainerEl, 70, "maple", buildingBlocks.length);
  addBlock(blockInputContainerEl, 30, "oak", buildingBlocks.length);

  // makeColumns (totalLengthInputEl, totalLengthEl, cuttingBoardContainerEl)
  totalLengthEl.innerText = totalLengthInputEl.value;
  totalLengthInput.addEventListener("input", () => {
    // makeColumns (totalLengthInputEl, totalLengthEl, cuttingBoardContainerEl)
    totalLengthEl.innerText = totalLengthInputEl.value;
    totalLength = totalLengthInputEl.value;
  });

  let totalWidthInput = document.getElementById("totalWidthInput");
  let totalWidthEl = document.getElementById("totalWidth");
  totalWidthEl.innerText = totalWidthInput.value;
  totalWidth = totalWidthInput.value;

  totalWidthInput.addEventListener("input", () => {
    const newWidth = parseInt(totalWidthInput.value);
    if (newWidth > buildingBlocks.length * maxBlockLength) {
      for (let index = 0; index < minBlockLength / blockLengthStep; index++) {
        blockIndex = index % buildingBlocks.length;
        setRangeValue(blockInputContainerEl, blockIndex, -blockLengthStep);
      }
      let woodType;
      do {
        woodType = woodTypes[getRandomInt(woodTypes.length)];
      } while (woodType == buildingBlocks[buildingBlocks.length - 1].woodType);
      addBlock(
        blockInputContainerEl,
        minBlockLength,
        woodType,
        buildingBlocks.length
      );
    }

    const difference = parseInt(totalWidthInput.value) - totalWidth;
    const diffSteps = Math.abs(difference) / blockLengthStep;
    for (let step = 0; step < diffSteps; step++) {
      const blockLengthDifference = Math.sign(difference) * blockLengthStep;
      blockID = blockID % buildingBlocks.length;
      const index = setRangeValue(
        blockInputContainerEl,
        blockID,
        blockLengthDifference
      );
      blockID++;

      let positions = grid[0][index].getVerticesData(
        BABYLON.VertexBuffer.PositionKind
      );
      const numberOfVertices = positions.length / 3;
      for (let i = 0; i < numberOfVertices; i++) {
        positions[i * 3 + 2] +=
          ((Math.sign(positions[i * 3 + 2]) * blockLengthDifference) / 2.0) *
          scaleFactor;
      }

      grid.forEach((column) => {
        for (let boxID = 0; boxID < index; boxID++) {
          column[boxID].position.z +=
            (blockLengthDifference / 2.0) * scaleFactor;
        }
        for (let boxID = index + 1; boxID < column.length; boxID++) {
          column[boxID].position.z -=
            (blockLengthDifference / 2.0) * scaleFactor;
        }

        column[index].updateVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          positions
        );
      });
    }

    totalWidth = newWidth;
    totalWidthEl.innerText = newWidth;
  });

  let totalHeightInput = document.getElementById("totalHeightInput");
  let totalHeightEl = document.getElementById("totalHeight");
  totalHeightEl.innerText = totalHeightInput.value;
  totalHeight = totalHeightInput.value;

  totalHeightInput.addEventListener("input", () => {
    totalHeightEl.innerText = totalHeightInput.value;
    totalHeight = totalHeightInput.value;
  });
});

// let makeColumns = (totalLengthInputEl, totalLengthEl, cuttingBoardContainerEl) => {
//     totalLengthEl.innerText = totalLengthInputEl.value;
//     // create columns
//     columnCount = totalLengthInputEl.value / totalLengthInputEl.step;
//     cuttingBoardContainerEl.innerHTML = "";
//     for (let column = 0; column < columnCount; column++) {
//         let col = document.createElement('div');
//         col.classList.add('block__column');
//         for (let row = 0; row < buildingBlocks.length; row++) {
//             if (alternating == true && column % 2 !== 0)
//             {
//                 index = buildingBlocks.length -1 - row;
//             }
//             else {
//                 index = row;
//             }
//             let block = document.createElement('div');
//             block.style.width = `${totalLengthInputEl.step}px`;
//             block.style.height = `${buildingBlocks[index].length}px`;
//             block.style.backgroundColor = buildingBlocks[index].color;
//             block.classList.add('block__row');
//             col.appendChild(block);
//         }
//         cuttingBoardContainerEl.appendChild(col);
//     }
// }

let addBlock = (blockInputContainerEl, length, woodType, buildingBlockID) => {
  let block = document.createElement("div");
  block.classList.add(`container__input-group`);
  block.innerHTML = `        
        <div class="input-group">
            <label for="blockLengthInput${
              buildingBlocks.length
            }" class="input-group__label">Länge: <span id="blockLength${
    buildingBlocks.length
  }">${length}</span> mm</label>
            <input type="range" min="${minBlockLength}" max="${maxBlockLength}" value="${length}" step="${blockLengthStep}" id="blockLengthInput${
    buildingBlocks.length
  }" class="input-group__input input-group__input-range ignore">
        </div>
        <div class="input-group">
            <select name="wood${buildingBlocks.length}" id="woodInput${
    buildingBlocks.length
  }" class="input-group__input input-group__input-select">
                <option class="input-select__option" value="oak" ${
                  woodType == "oak" ? "selected" : ""
                }>Eiche</option>
                <option class="input-select__option" value="walnut" ${
                  woodType == "walnut" ? "selected" : ""
                }>Nussbaum</option>
                <option class="input-select__option" value="maple" ${
                  woodType == "maple" ? "selected" : ""
                }>Ahorn</option>
            </select>
        </div>
        <div class="color-swatch" style="background-color: ${
          colors[woodType]
        };"></div>
        <div class="btn btn__add btn--green"></div>
        <div class="btn btn__remove btn--red"></div>
        <div class="btn btn__move"></div>
        
    `;
  const rangeInputSlider = block.querySelector(".input-group__input"); //childNodes[1].childNodes[3];
  const rangeInputLabel = block.querySelector(
    `#blockLength${buildingBlocks.length}`
  ); //childNodes[1].childNodes[1].childNodes[1];
  const woodTypeInput = block.querySelector(".input-group__input-select");
  const addBtn = block.querySelector(".btn__add");
  const removeBtn = block.querySelector(".btn__remove");

  buildingBlocks.splice(buildingBlockID, 0, {
    length,
    woodType,
    color: colors[woodType],
  });
  blockInputContainerEl.insertBefore(
    block,
    blockInputContainerEl.children[buildingBlockID]
  );
  // blockInputContainerEl.appendChild(block);

  rangeInputSlider.addEventListener("input", function () {
    const index = Array.from(blockInputContainerEl.children).indexOf(block);
    const oldValue = buildingBlocks[index].length;
    const newValue = parseInt(this.value);
    const difference = oldValue - newValue;

    const diffSteps = Math.abs(difference) / blockLengthStep;
    for (let step = 0; step < diffSteps; step++) {
      const blockLengthDifference = Math.sign(difference) * blockLengthStep;
      const nextIndex = setRangeValue(
        blockInputContainerEl,
        index + 1,
        blockLengthDifference
      );

      let translateZ = blockLengthStep * scaleFactor;
      let lowerIndex;
      let upperIndex;
      let positionsLowerIndex;
      let positionsUpperIndex;
      if (Math.min(index, nextIndex) == index) {
        lowerIndex = index;
        upperIndex = nextIndex;
        positionsLowerIndex = grid[0][index].getVerticesData(
          BABYLON.VertexBuffer.PositionKind
        );
        positionsUpperIndex = grid[0][nextIndex].getVerticesData(
          BABYLON.VertexBuffer.PositionKind
        );
        translateZ *= Math.sign(difference);
        const numberOfVertices = positionsLowerIndex.length / 3;
        for (let i = 0; i < numberOfVertices; i++) {
          positionsLowerIndex[i * 3 + 2] -=
            (Math.sign(positionsLowerIndex[i * 3 + 2]) * translateZ) / 2.0; // * Math.sign(difference);
          positionsUpperIndex[i * 3 + 2] +=
            (Math.sign(positionsUpperIndex[i * 3 + 2]) * translateZ) / 2.0; // * Math.sign(-difference);
        }
      } else {
        lowerIndex = nextIndex;
        upperIndex = index;
        positionsLowerIndex = grid[0][nextIndex].getVerticesData(
          BABYLON.VertexBuffer.PositionKind
        );
        positionsUpperIndex = grid[0][index].getVerticesData(
          BABYLON.VertexBuffer.PositionKind
        );
        translateZ *= Math.sign(-difference);
        const numberOfVertices = positionsLowerIndex.length / 3;
        for (let i = 0; i < numberOfVertices; i++) {
          positionsLowerIndex[i * 3 + 2] -=
            (Math.sign(positionsLowerIndex[i * 3 + 2]) * translateZ) / 2.0; // * Math.sign(-difference);
          positionsUpperIndex[i * 3 + 2] +=
            (Math.sign(positionsUpperIndex[i * 3 + 2]) * translateZ) / 2.0; // * Math.sign(difference);
        }
      }
      grid.forEach((column) => {
        for (let boxID = lowerIndex + 1; boxID < upperIndex; boxID++) {
          column[boxID].position.z += translateZ;
        }
        column[lowerIndex].position.z += translateZ / 2.0;
        column[upperIndex].position.z += translateZ / 2.0;
        column[lowerIndex].updateVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          positionsLowerIndex
        );
        column[upperIndex].updateVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          positionsUpperIndex
        );
      });
    }

    rangeInputLabel.innerText = newValue;
    buildingBlocks[index].length = newValue;

    console.log(buildingBlocks);
  });

  woodTypeInput.addEventListener("change", function () {
    const index = Array.from(blockInputContainerEl.children).indexOf(block);
    const woodType = this.value;
    buildingBlocks[index].color = colors[woodType];
    buildingBlocks[index].woodType = woodType;
    const colorSwatch = blockInputContainerEl.children[index].querySelector(
      ".color-swatch"
    );
    colorSwatch.style.backgroundColor = colors[woodType];
    console.log(buildingBlocks);
    grid.forEach((column) => {
      column[index].material = material[woodType];
    });
  });

  addBtn.addEventListener("click", () => {
    if (buildingBlocks.length > maxBlocks - 1) {
      return;
    }
    const index = Array.from(blockInputContainerEl.children).indexOf(block);
    let woodType;
    do {
      woodType = woodTypes[getRandomInt(woodTypes.length)];
    } while (
      woodType == buildingBlocks[index].woodType ||
      woodType == buildingBlocks[(index + 1) % buildingBlocks.length].woodType
    );
    addBlock(blockInputContainerEl, 20, woodType, index + 1);




    // const oldValue = buildingBlocks[index].length;
    // const newValue = 0;
    // const difference = oldValue - newValue;

    // const diffSteps = Math.abs(difference) / blockLengthStep;
    // for (let step = 0; step < diffSteps; step++) {
    //   const blockLengthDifference = Math.sign(difference) * blockLengthStep;
    //   if (blockID == index) {
    //     blockID++;
    //   }
    //   blockID = blockID % buildingBlocks.length;
    //   const nextIndex = setRangeValue(
    //     blockInputContainerEl,
    //     blockID,
    //     blockLengthDifference
    //   );
    //   blockID++;

    //   let translateZ = blockLengthStep * scaleFactor;
    //   let lowerIndex;
    //   let upperIndex;
    //   // let positionsLowerIndex;
    //   let positionsNextIndex;
    //   if (Math.min(index, nextIndex) == index) {
    //     lowerIndex = index;
    //     upperIndex = nextIndex;
    //     // positionsLowerIndex = grid[0][index].getVerticesData(BABYLON.VertexBuffer.PositionKind);
    //     positionsNextIndex = grid[0][nextIndex].getVerticesData(
    //       BABYLON.VertexBuffer.PositionKind
    //     );
    //     translateZ *= Math.sign(difference);
    //     const numberOfVertices = positionsNextIndex.length / 3;
    //     for (let i = 0; i < numberOfVertices; i++) {
    //       // positionsLowerIndex[i * 3 + 2] -= Math.sign(positionsLowerIndex[i * 3 + 2]) * translateZ / 2.0;// * Math.sign(difference);
    //       positionsNextIndex[i * 3 + 2] +=
    //         (Math.sign(positionsNextIndex[i * 3 + 2]) * translateZ) / 2.0; // * Math.sign(-difference);
    //     }
    //   } else {
    //     lowerIndex = nextIndex;
    //     upperIndex = index;
    //     positionsNextIndex = grid[0][nextIndex].getVerticesData(
    //       BABYLON.VertexBuffer.PositionKind
    //     );
    //     // positionsUpperIndex = grid[0][index].getVerticesData(BABYLON.VertexBuffer.PositionKind);
    //     translateZ *= Math.sign(-difference);
    //     const numberOfVertices = positionsNextIndex.length / 3;
    //     for (let i = 0; i < numberOfVertices; i++) {
    //       positionsNextIndex[i * 3 + 2] -=
    //         (Math.sign(positionsNextIndex[i * 3 + 2]) * translateZ) / 2.0; // * Math.sign(-difference);
    //       // positionsUpperIndex[i * 3 + 2] += Math.sign(positionsUpperIndex[i * 3 + 2]) * translateZ / 2.0;// * Math.sign(difference);
    //     }
    //   }
    //   grid.forEach((column) => {
    //     for (let boxID = lowerIndex + 1; boxID < upperIndex; boxID++) {
    //       column[boxID].position.z += translateZ;
    //     }
    //     column[nextIndex].position.z += translateZ / 2.0;
    //     // column[upperIndex].position.z += translateZ / 2.0;
    //     column[nextIndex].updateVerticesData(
    //       BABYLON.VertexBuffer.PositionKind,
    //       positionsNextIndex
    //     );
    //     // column[upperIndex].updateVerticesData(BABYLON.VertexBuffer.PositionKind, positionsUpperIndex);
    //   });
    // }
    // grid.forEach((column) => {
    //   column[index].dispose();
    //   column.splice(index, 1);
    // });

    // this.parentNode.remove();
    // buildingBlocks.splice(index, 0,  {
    //   length,
    //   woodType,
    //   color: colors[woodType],
    // });






    if (buildingBlocks.length == maxBlocks) {
      hide(".btn__add");
    } else if (buildingBlocks.length == minBlocks + 1) {
      show(".btn__remove");
    }
    console.log(buildingBlocks);

    currentColId = 0;
    grid.forEach((column) => {
      let box = BABYLON.MeshBuilder.CreateBox(`box${index + 1}`, { width: blockWidth / 40, height: totalHeight / 40, depth: buildingBlocks[index + 1].length / 40, updatable: true }, scene);
      box.material = material[buildingBlocks[index + 1].woodType];
      box.position.x = currentColId * blockWidth / 2.0 * scaleFactor;
      column.splice(index + 1, 0, box);
      // translate previous blocks along x axis
      for (let colID = 0; colID < currentColId; colID++) {
        grid[colID][index + 1].position.x = grid[colID][index + 1].position.x - blockWidth / 2.0 * scaleFactor;
      }
      currentColId++;

    //   column.splice(index + 1, 0, box);
    //   column[index + 1].position.z += translateZ;

    //   column[nextIndex].position.z += translateZ / 2.0;
    //   column[nextIndex].updateVerticesData(
    //     BABYLON.VertexBuffer.PositionKind,
    //     positionsNextIndex
    //   );
    //   // column[upperIndex].updateVerticesData(BABYLON.VertexBuffer.PositionKind, positionsUpperIndex);
    });
    console.log(grid[0]);
  });

  removeBtn.addEventListener("click", function () {
    if (buildingBlocks.length < minBlocks + 1) {
      return;
    }
    const index = Array.from(blockInputContainerEl.children).indexOf(block);

    const oldValue = buildingBlocks[index].length;
    const newValue = 0;
    const difference = oldValue - newValue;

    const diffSteps = Math.abs(difference) / blockLengthStep;
    for (let step = 0; step < diffSteps; step++) {
      const blockLengthDifference = Math.sign(difference) * blockLengthStep;
      if (blockID == index) {
        blockID++;
      }
      blockID = blockID % buildingBlocks.length;
      const nextIndex = setRangeValue(
        blockInputContainerEl,
        blockID,
        blockLengthDifference
      );
      blockID++;

      let translateZ = blockLengthStep * scaleFactor;
      let lowerIndex;
      let upperIndex;
      // let positionsLowerIndex;
      let positionsNextIndex;
      if (Math.min(index, nextIndex) == index) {
        lowerIndex = index;
        upperIndex = nextIndex;
        // positionsLowerIndex = grid[0][index].getVerticesData(BABYLON.VertexBuffer.PositionKind);
        positionsNextIndex = grid[0][nextIndex].getVerticesData(
          BABYLON.VertexBuffer.PositionKind
        );
        translateZ *= Math.sign(difference);
        const numberOfVertices = positionsNextIndex.length / 3;
        for (let i = 0; i < numberOfVertices; i++) {
          // positionsLowerIndex[i * 3 + 2] -= Math.sign(positionsLowerIndex[i * 3 + 2]) * translateZ / 2.0;// * Math.sign(difference);
          positionsNextIndex[i * 3 + 2] +=
            (Math.sign(positionsNextIndex[i * 3 + 2]) * translateZ) / 2.0; // * Math.sign(-difference);
        }
      } else {
        lowerIndex = nextIndex;
        upperIndex = index;
        positionsNextIndex = grid[0][nextIndex].getVerticesData(
          BABYLON.VertexBuffer.PositionKind
        );
        // positionsUpperIndex = grid[0][index].getVerticesData(BABYLON.VertexBuffer.PositionKind);
        translateZ *= Math.sign(-difference);
        const numberOfVertices = positionsNextIndex.length / 3;
        for (let i = 0; i < numberOfVertices; i++) {
          positionsNextIndex[i * 3 + 2] -=
            (Math.sign(positionsNextIndex[i * 3 + 2]) * translateZ) / 2.0; // * Math.sign(-difference);
          // positionsUpperIndex[i * 3 + 2] += Math.sign(positionsUpperIndex[i * 3 + 2]) * translateZ / 2.0;// * Math.sign(difference);
        }
      }
      grid.forEach((column) => {
        for (let boxID = lowerIndex + 1; boxID < upperIndex; boxID++) {
          column[boxID].position.z += translateZ;
        }
        column[nextIndex].position.z += translateZ / 2.0;
        // column[upperIndex].position.z += translateZ / 2.0;
        column[nextIndex].updateVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          positionsNextIndex
        );
        // column[upperIndex].updateVerticesData(BABYLON.VertexBuffer.PositionKind, positionsUpperIndex);
      });
    }
    grid.forEach((column) => {
      column[index].dispose();
      column.splice(index, 1);
    });

    this.parentNode.remove();
    buildingBlocks.splice(index, 1);
    if (buildingBlocks.length == minBlocks) {
      hide(".btn__remove");
    } else if (buildingBlocks.length == maxBlocks - 1) {
      show(".btn__add");
    }

    console.log(buildingBlocks);
  });
};
