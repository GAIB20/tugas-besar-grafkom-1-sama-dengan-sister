class Transformation {
  constructor(x, y, z, rx, ry, rz, s, shx, shy, shz) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rx = rx;
    this.ry = ry;
    this.rz = rz;
    this.s = s;
    this.shx = shx;
    this.shy = shy;
    this.shz = shz;
  }

  getTranslation = () => {
    return [this.x, this.y, this.z];
  };

  setTranslation = (x, y, z) => {
    this.x = x;
    this.y = y;
    this.z = z;
  };

  getRotation = () => {
    return [this.rx, this.ry, this.rz];
  };

  setRotation = (rx, ry, rz) => {
    this.rx = rx;
    this.ry = ry;
    this.rz = rz;
  };

  getScale = () => {
    return this.s;
  };

  setScale = (s) => {
    this.s = s;
  };

  getShear = () => {
    return [this.shx, this.shy, this.shz];
  };

  setShear = (shx, shy, shz) => {
    this.shx = shx;
    this.shy = shy;
    this.shz = shz;
  };

  print = () => {
    console.log("Translation x, y, z: ", this.x, this.y, this.z);
    console.log("Rotation rx, ry, rz: ", this.rx, this.ry, this.rz);
    console.log("Scale: ", this.s);
    console.log("Shear shx, shy, shz: ", this.shx, this.shy, this.shz);
  };
}

export default Transformation;
