import WebGL from "../gl/webgl";
import fragmentSource from "../init/fragment_shader";
import vertexSource from "../init/vertex_shader";

export default function drawPolygon() {
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

  webglUtils.resizeCanvasToDisplaySize(canvas);
  const webgl = new WebGL(gl);
  const vertexShader = webgl.createShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = webgl.createShader(gl.FRAGMENT_SHADER, fragmentSource);
  webgl.createProgram(vertexShader, fragmentShader);
  webgl.attribLocation();
  webgl.createAndBindBuffer();

  const positions = [
    // triangle 1
    -0.9, 0.9, 0.9, 0.9, -0.9, -0.9,
    // triangle 2
    0.9, 0.9, 0.9, -0.9, -0.9, -0.9,
  ];

  // console.log("Ini positions : ", positions);

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

  const primitiveType = webgl.gl.TRIANGLE_STRIP; // Changed to TRIANGLE_FAN
  const count = 3; // Draw 3 vertices
  webgl.draw(primitiveType, count);
}
