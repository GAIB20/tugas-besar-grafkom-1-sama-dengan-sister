export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  updateX(_x) {
    this.x = _x;
  }

  updateY(_y) {
    this.y = _y;
  }

  updatePoint(_x, _y) {
    this.x = _x;
    this.y = _y;
  }
}
