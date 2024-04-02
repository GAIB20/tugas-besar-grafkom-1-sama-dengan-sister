import { GLCCommand } from "../glc/glc";
import { ModelType } from "../models/modelType";
import Renderer from "../render/render";
import * as webglUtils from "webgl-utils.js";

export const drawTriangle = () => {
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
  const glc = new GLCCommand(gl)
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  const renderer = new Renderer(gl);

  var positions = [0, 0.5, 0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0];
  const indices = [0, 1, 2];

  renderer.registerNewModel(new ModelType(positions, indices, gl), "triangle");
  renderer.addInstance("instance1", "triangle");
  glc.clear(1, 1, 1, 1);

  renderer.render();
};
