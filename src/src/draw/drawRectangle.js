import { GLCCommand } from "../glc/glc";
import { ModelType } from "../models/modelType";
import Renderer from "../render/render";
import * as webglUtils from "webgl-utils.js";

export const drawRectangle = () => {
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    console.log("Something wrong when checking canvas");
    return;
  }

  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.log("Something went wrong when checking context");
    return;
  }
  const glc = new GLCCommand(gl);
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  const renderer = new Renderer(gl);

  var positions = [
    -0.5, 0.5, 0, 0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,
  ];
  const indices = [0, 1, 2, 2, 0, 3];

  var translation = [100, 150];
  var rotation = [0, 1];


  renderer.registerNewModel(new ModelType(positions, indices, gl), "rectangle");
  renderer.addInstance("instance1", "rectangle");
  glc.clear(1, 1, 1, 1);

  renderer.render();
};

const reRender = () => {};
