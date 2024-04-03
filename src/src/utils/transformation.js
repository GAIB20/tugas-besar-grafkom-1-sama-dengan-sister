import Matrix from "./matrix";

const TRANSLATION_MULTIPLIER = 1000;
const ROTATION_MULTIPLIER = 360;
const SCALE_MULTIPLIER = 5;
const SHEAR_MULTIPLIER = 1;

const degToRad = (deg) => {
  return deg * (Math.PI / 180);
};

class Transformation {
  constructor(x, y, rz, sx, sy, shx, shy) {
    this.x = x;
    this.y = y;
    this.rz = rz;
    this.sx = sx;
    this.sy = sy;
    this.shx = shx;
    this.shy = shy;

    // this.translationMatrix = this.generateTranslationMatrix(
    //   Number(x),
    //   Number(y)
    // );
  }

  calculateTransformationMatrix() {
    this.transformationMatrix = new Matrix(4, 4);
    this.transformationMatrix.makeIdentityMatrix();
    var translationMatrix = this.generateTranslationMatrix(this.x, this.y);
    var rotationZMatrix = this.generateRotationZMatrix(this.rz);
    var scaleMatrix = this.generateScaleMatrix(this.sx, this.sy);
    var shearMatrix = this.generateShearMatrix(this.shx, this.shy);

    this.transformationMatrix.multiplyMatrix(translationMatrix);
    this.transformationMatrix.multiplyMatrix(rotationZMatrix);
    this.transformationMatrix.multiplyMatrix(scaleMatrix);
    this.transformationMatrix.multiplyMatrix(shearMatrix);

    return this.transformationMatrix;
  }

  generateTranslationMatrix(tx, ty) {
    const firstRow = [1, 0, 0, tx * TRANSLATION_MULTIPLIER];
    const secondRow = [0, 1, 0, ty * TRANSLATION_MULTIPLIER];
    const thirdRow = [0, 0, 1, 0];
    const fourthRow = [0, 0, 0, 1];
    var matrix = new Matrix(4, 4);
    matrix.insertMatrix([firstRow, secondRow, thirdRow, fourthRow]);
    return matrix;
  }

  // translate = (point) => {
  //   const position = [point.x, point.y, 1];
  //   const translatedMatrix = this.translationMatrix.multiplyMatrix(position);
  //   return new Point(translatedMatrix[0], translatedMatrix[1]);
  // };

  generateRotationZMatrix(deg) {
    const rad = degToRad(deg * ROTATION_MULTIPLIER);
    const firstRow = [Math.cos(rad), -Math.sin(rad), 0, 0];
    const secondRow = [Math.sin(rad), Math.cos(rad), 0, 0];
    const thirdRow = [0, 0, 1, 0];
    const fourthRow = [0, 0, 0, 1];
    var matrix = new Matrix(4, 4);
    matrix.insertMatrix([firstRow, secondRow, thirdRow, fourthRow]);
    return matrix;
  }

  generateScaleMatrix(sx, sy) {
    const sxExponent = SCALE_MULTIPLIER ** sx;
    const syExponent = SCALE_MULTIPLIER ** sy;
    const firstRow = [sxExponent, 0, 0, 0];
    const secondRow = [0, syExponent, 0, 0];
    const thirdRow = [0, 0, 1, 0];
    const fourthRow = [0, 0, 0, 1];
    var matrix = new Matrix(4, 4);
    matrix.insertMatrix([firstRow, secondRow, thirdRow, fourthRow]);
    return matrix;
  }

  generateShearMatrix(shx, shy) {
    const firstRow = [1, shy * SHEAR_MULTIPLIER, 0, 0];
    const secondRow = [shx * SHEAR_MULTIPLIER, 1, 0, 0];
    const thirdRow = [0, 0, 1, 0];
    const fourthRow = [0, 0, 0, 1];
    var matrix = new Matrix(4, 4);
    matrix.insertMatrix([firstRow, secondRow, thirdRow, fourthRow]);
    return matrix;
  }

  getTranslation = () => {
    return [this.x, this.y];
  };

  setTranslation = (x, y) => {
    this.x = x;
    this.y = y;
  };

  getRotation = () => {
    return this.rz;
  };

  setRotation = (rz) => {
    this.rz = rz;
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
    console.log("Rotation rz: ", this.rz);
    console.log("Scale sx sy: ", this.sx, this.sy);
    console.log("Shear shx, shy: ", this.shx, this.shy);
  };

  getAllData = () => {
    return {
      x: this.x,
      y: this.y,
      rz: this.rz,
      sx: this.sx,
      sy: this.sy,
      shx: this.shx,
      shy: this.shy,
    };
  };

  difference = (tr) => {
    var allData = tr.getAllData();
    this.x = allData.x - this.x;
    this.y = allData.y - this.y;
    this.rz = allData.rz - this.rz;
    this.sx = allData.sx - this.sx;
    this.sy = allData.sy - this.sy;
    this.shx = allData.shx - this.shx;
    this.shy = allData.shy - this.shy;
  };
}

export default Transformation;
