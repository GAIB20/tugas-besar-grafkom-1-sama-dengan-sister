import Matrix from "./matrix";

const TRANSLATION_MULTIPLIER = 1000;
const ROTATION_MULTIPLIER = 360;
const SCALE_MULTIPLIER = 5;
const SHEAR_MULTIPLIER = 1;

const degToRad = (deg) => {
  return deg * (Math.PI / 180);
};

class Transformation {
  constructor(x, y, rz, rvz, sx, sy, shx, shy) {
    this.x = x;
    this.y = y;
    this.rz = rz;
    this.rvz = rvz;
    this.sx = sx;
    this.sy = sy;
    this.shx = shx;
    this.shy = shy;
  }

  calculateTransformationMatrix(
    centerX,
    centerY,
    centerXCanvas,
    centerYCanvas
  ) {
    this.transformationMatrix = new Matrix(4, 4);
    this.transformationMatrix.makeIdentityMatrix();
    var translationMatrix = this.generateTranslationMatrix(
      this.x * TRANSLATION_MULTIPLIER,
      this.y * TRANSLATION_MULTIPLIER
    );
    var rotateZMatrix = this.generateRelativeRotateZMatrix(
      this.rz,
      centerX,
      centerY
    );
    var revolveZMatrix = this.generateRevolveZCenterMatrix(
      this.rvz,
      centerXCanvas,
      centerYCanvas
    );
    var scaleMatrix = this.generateRelativeScaleMatrix(
      this.sx,
      this.sy,
      centerX,
      centerY
    );
    var shearMatrix = this.generateRelativeShearMatrix(
      this.shx,
      this.shy,
      centerX,
      centerY
    );

    this.transformationMatrix.multiplyMatrix(translationMatrix);
    this.transformationMatrix.multiplyMatrix(rotateZMatrix);
    this.transformationMatrix.multiplyMatrix(revolveZMatrix);
    this.transformationMatrix.multiplyMatrix(scaleMatrix);
    this.transformationMatrix.multiplyMatrix(shearMatrix);

    return this.transformationMatrix;
  }

  generateTranslationMatrix(tx, ty) {
    const firstRow = [1, 0, 0, tx];
    const secondRow = [0, 1, 0, ty];
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

  generateRelativeRotateZMatrix(deg, centerX, centerY) {
    const initTranslateMat = this.generateTranslationMatrix(-centerX, -centerY);
    const rotateMat = this.generateRotationZMatrix(deg);
    const lateTranslateMat = this.generateTranslationMatrix(centerX, centerY);
    rotateMat.multiplyMatrix(initTranslateMat);
    lateTranslateMat.multiplyMatrix(rotateMat);
    return lateTranslateMat;
  }

  generateRevolveZCenterMatrix(deg, centerXCanvas, centerYCanvas) {
    const initTranslateMat = this.generateTranslationMatrix(
      -centerXCanvas,
      -centerYCanvas
    );
    const rotateMat = this.generateRotationZMatrix(deg);
    const lateTranslateMat = this.generateTranslationMatrix(
      centerXCanvas,
      centerYCanvas
    );
    rotateMat.multiplyMatrix(initTranslateMat);
    lateTranslateMat.multiplyMatrix(rotateMat);
    return lateTranslateMat;
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

  generateRelativeScaleMatrix(sx, sy, centerX, centerY) {
    const initTranslateMat = this.generateTranslationMatrix(-centerX, -centerY);
    const rotateMat = this.generateScaleMatrix(sx, sy);
    const lateTranslateMat = this.generateTranslationMatrix(centerX, centerY);
    rotateMat.multiplyMatrix(initTranslateMat);
    lateTranslateMat.multiplyMatrix(rotateMat);
    return lateTranslateMat;
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

  generateRelativeShearMatrix(shx, shy, centerX, centerY) {
    const initTranslateMat = this.generateTranslationMatrix(-centerX, -centerY);
    const rotateMat = this.generateShearMatrix(shx, shy);
    const lateTranslateMat = this.generateTranslationMatrix(centerX, centerY);
    rotateMat.multiplyMatrix(initTranslateMat);
    lateTranslateMat.multiplyMatrix(rotateMat);
    return lateTranslateMat;
  }

  getTranslation = () => {
    return [this.x, this.y];
  };

  setTranslation = (x, y) => {
    this.x = x;
    this.y = y;
  };

  getRotation = () => {
    return [this.rz, this.rvz];
  };

  setRotation = (rz, rvz) => {
    this.rz = rz;
    this.rvz = rvz;
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
    console.log("Rotation rz, rvz: ", this.rz, this.rvz);
    console.log("Scale sx sy: ", this.sx, this.sy);
    console.log("Shear shx, shy: ", this.shx, this.shy);
  };

  getAllData = () => {
    return {
      x: this.x,
      y: this.y,
      rz: this.rz,
      rvz: this.rvz,
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
    this.rvz = allData.rvz - this.rvz;
    this.sx = allData.sx - this.sx;
    this.sy = allData.sy - this.sy;
    this.shx = allData.shx - this.shx;
    this.shy = allData.shy - this.shy;
  };
}

export default Transformation;
