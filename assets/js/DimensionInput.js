class DimensionInput{
  constructor(name, label, unit, value, min, max, step) {
    this.name = name;
    this.label = label;
    this.unit = unit;
    this.value = value;
    this.min = min;
    this.max = max;
    this.step = step;
  }
}

class MainDimensionInput extends DimensionInput {
  constructor(name, label, unit, value, min, max, step) {
    super(name, label, unit, value, min, max, step);
    this.create();
  }

  create() {
    const inputEl = document.createElement("input");
    inputEl.setAttribute("type", "range");
    inputEl.setAttribute("min", this.min);
    inputEl.setAttribute("max", this.max);
    inputEl.setAttribute("value", this.value);
    inputEl.setAttribute("step", this.step);
    inputEl.setAttribute("id", `total${this.name}Input`);
    inputEl.classList.add("input-group__input");
    inputEl.classList.add("input-group__input-range");
    this.inputEl = inputEl;

    const labelValueEl = document.createElement('span');
    labelValueEl.innerHTML = this.value
    this.labelValueEl = labelValueEl;

    const labelEl = document.createElement("label");
    labelEl.setAttribute("for", `total${this.name}Input`);
    labelEl.classList.add("input-group__label");
    labelEl.innerHTML += `${this.label} `;
    labelEl.appendChild(labelValueEl);
    labelEl.innerHTML += ` ${this.unit}`;
    this.labelEl = labelEl;

    const inputGroupEl = document.createElement("div");
    inputGroupEl.classList.add("input-group");
    inputGroupEl.appendChild(inputEl);
    inputGroupEl.appendChild(labelEl);

    this.inputGroupEl = inputGroupEl;
  }
}

export {DimensionInput, MainDimensionInput};