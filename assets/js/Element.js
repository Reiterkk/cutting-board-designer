export default class Element {
  constructor() {
    this.instances = [];
  }

  addInstanceAtPosition(position) {
    if (position > this.instances.length) {
      console.log(
        `Can't add new instance at position ${position} since only ${this.instances.length} instances are available.`
      );
    }
  }

  addInstance() {}

  setXPosition() {}

  setZPosition() {
    array.forEach((element) => {});
    this.instances.forEach((instance) => {});
  }
}
