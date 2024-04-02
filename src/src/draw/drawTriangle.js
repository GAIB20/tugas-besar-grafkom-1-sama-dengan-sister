import WebGL from "../gl/webgl";
import fragmentSource from "../init/fragment_shader";
import vertexSource from "../init/vertex_shader";
import * as webglUtils from "webgl-utils.js";

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("ERROR compiling shader!", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program!", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export const drawTriangle = () => {
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

  const positions = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];

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
  const count = 3; // Draw 3 vertices
  webgl.draw(primitiveType, count);
};

export default drawTriangle;
