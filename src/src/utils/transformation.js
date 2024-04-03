class Transformation {
  constructor(x, y, rx, ry, sx, sy, shx, shy) {
    this.x = x;
    this.y = y;
    this.rx = rx;
    this.ry = ry;
    this.sx = sx;
    this.sy = sy;
    this.shx = shx;
    this.shy = shy;
  }

  getTranslation = () => {
    return [this.x, this.y];
  };

  setTranslation = (x, y) => {
    this.x = x;
    this.y = y;
  };

  getRotation = () => {
    return [this.rx, this.ry];
  };

  setRotation = (rx, ry) => {
    this.rx = rx;
    this.ry = ry;
  };

  getScale = () => {
    return [this.sx, this.sy];
  };

  setScale = (sx, sy) => {
    this.sx = sx;
    this.sy = sy;
  };

  getShear = () => {
    return [this.shx, this.shy];
  };

  setShear = (shx, shy) => {
    this.shx = shx;
    this.shy = shy;
  };

  print = () => {
    console.log("Translation x, y: ", this.x, this.y);
    console.log("Rotation rx, ry: ", this.rx, this.ry);
    console.log("Scale sx sy: ", this.sx, this.sy);
    console.log("Shear shx, shy: ", this.sh, this.sh, this.sh);
  };
}

export default Transformation;
