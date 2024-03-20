import createShader from "../init/create_shader";
import createProgram from "../init/create_program";
import vertexShader from "../init/vertex_shader";
import fragmentShader from "../init/fragment_shader";

export const drawRectangle = () => {
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  var vertexShaderSource = vertexShader;
  var fragmentShaderSource = fragmentShader;

  var vertexShaderObject = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
  );

  var fragmentShaderObject = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  var program = createProgram(gl, vertexShaderObject, fragmentShaderObject);
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [0.1, 0.2, 0.8, 0.2, 0.1, 0.3, 0.1, 0.3, 0.8, 0.2, 0.8, 0.3];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var size = 2;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  var primitiveType = gl.TRIANGLES;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
};
