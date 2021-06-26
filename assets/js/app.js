import WoodType from './WoodType.js';
import Board from './Board.js';
import Element from './Element.js';
import {MainDimensionInput} from './DimensionInput.js';

class Dimension {
  constructor(value, min, max, step) {
    this.value = value;
    this.min = min;
    this.max = max;
    this.step = step;
  }
}

const boardSettings = {
  mainInputs: {
    length : new MainDimensionInput('Length', 'Länge:', 'mm', 320, 320, 600, 40),
    width : new MainDimensionInput('Width', 'Breite:', 'mm', 200, 200, 450, 5),
    height : new MainDimensionInput('Length', 'Länge:', 'mm', 40, 40, 60, 5),
  },
  elementWidth: 40,
  containerEl: document.getElementById("boardContainer"),
  elements: [{}],
};

const woodTypes = {};
woodTypes.maple = new WoodType("maple", "#D9BC9A", "maple");
woodTypes.oak = new WoodType("oak", "#BF8563", "oak");
woodTypes.walnut = new WoodType("walnut", "#40221B", "walnut");
console.log(woodTypes);

const board = new Board(boardSettings);
board.create();
