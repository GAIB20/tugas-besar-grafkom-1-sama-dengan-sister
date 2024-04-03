import { Point } from "../model/point";
import { TransformationMatrix } from "./transformation-matrix";

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
    this.translationMatrix = this.generateTranslationMatrix(Number(x), Number(y));
  }

  generateTranslationMatrix(tx, ty) {
    const firstRow = [1, 0, tx];
    const secondRow = [0, 1, ty];
    const thirdRow = [0, 0, 1];
    return new TransformationMatrix(firstRow, secondRow, thirdRow);
  }
  translate = (point) => {
    const position = [point.x, point.y, 1];
    const translatedMatrix = this.translationMatrix.multiplyMatrix(position);
    return new Point(translatedMatrix[0], translatedMatrix[1]);
  };

  multiplyMatrix() {}
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

  // updateTransformation = (x, y, rx, ry, sx, sy, shx, shy) => {
  //   this.x = x;
  //   this.y = y;
  //   this.rx = rx;
  //   this.ry = ry;
  //   this.sx = sx;
  //   this.sy = sy;
  //   this.shx = shx;
  //   this.shy = shy;
  // };
}

export default Transformation;
