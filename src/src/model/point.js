
export class Point {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
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
  
  updateColor(color) {
    this.color.updateColor(color);
  }
}
