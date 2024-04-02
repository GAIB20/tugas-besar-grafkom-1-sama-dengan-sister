
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
  
  webglUtils.resizeCanvasToDisplaySize(canvas)
};