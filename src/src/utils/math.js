import { mat4, vec3 } from "gl-matrix";

const degToRad = (deg) => {
  return deg * (Math.PI / 180);
};

// const radToDef = (rad) => {
//   return rad * (180 / Math.PI);
// };

export const createIdentityMatrix = () => {
  var matrix = [];
  mat4.identity(matrix);
  return matrix;
};

export const translateMatrix = (mat, x, y, z) => {
  mat4.translate(mat, mat, vec3.fromValues(x, y, z));
  return mat;
};

export const rotateXMatrix = (mat, deg) => {
  mat4.rotateX(mat, mat, degToRad(deg));
  return mat;
};

export const rotateYMatrix = (mat, deg) => {
  mat4.rotateY(mat, mat, degToRad(deg));
  return mat;
};

export const rotateZMatrix = (mat, deg) => {
  mat4.rotateZ(mat, mat, degToRad(deg));
  return mat;
};

export const scaleMatrix = (mat, scale) => {
  mat4.scale(mat, mat, vec3.fromValues(scale, scale, scale));
  return mat;
};
