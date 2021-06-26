export default class Board {
  constructor(boardSettings) {
    this.mainInputs = boardSettings.mainInputs;
    this.elements = boardSettings.elements;
    this.dimensions = boardSettings.dimensions;
    this.containerEl = boardSettings.containerEl;
  }

  create() {
    this.mainInputs.containerEl = document.createElement("div");
    this.mainInputs.containerEl.appendChild(
      this.mainInputs.length.inputGroupEl
    );
    this.mainInputs.containerEl.appendChild(
      this.mainInputs.width.inputGroupEl
    );
    this.mainInputs.containerEl.appendChild(
      this.mainInputs.height.inputGroupEl
    );
    this.mainInputs.containerEl.classList.add("input-group");

    this.containerEl.appendChild(this.mainInputs.containerEl);
  }

  createElements() {
    this.elements.forEach((element) => {
      this.addElement(element);
    });
  }

  addElement() {}
}
