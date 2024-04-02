
import * as webglUtils from "webgl-utils.js";
import WebGL from "../gl/webgl";
import vertexSource from "../init/vertex_shader";
import fragmentSource from "../init/fragment_shader";

export const drawRectangle = () => {
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    console.log("Canvas not found");
    return;
  }
  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("WebGL not supported");
    return;
  }
  webglUtils.resizeCanvasToDisplaySize(canvas);

  const webgl = new WebGL(gl);
  const vertexShader = webgl.createShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = webgl.createShader(gl.FRAGMENT_SHADER, fragmentSource);
  webgl.createProgram(vertexShader, fragmentShader);
  webgl.attribLocation()
  webgl.createAndBindBuffer();

  const positions = [
    -0.5,  0.5, // Top left
     0.5,  0.5, // Top right
    -0.5, -0.5, // Bottom left
    -0.5, -0.5, // Bottom left
     0.5,  0.5, // Top right
     0.5, -0.5, // Bottom right
];
  webgl.bufferData(positions);

  webgl.setViewPort();
  webgl.clear();
  webgl.useProgramAndEnableVertex();

  webgl.bindBuffer();
  const size = 2; 
  const type = webgl.gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0; 
  webgl.vertexAttribPointer(size, type, normalize, stride, offset);

  const primitiveType = webgl.gl.TRIANGLES;
  const count = 6 // Draw 3 vertices
  webgl.draw(primitiveType, count);
};