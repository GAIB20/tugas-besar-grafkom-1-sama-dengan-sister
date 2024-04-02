export default class WebGL {
  constructor(gl) {
    this.gl = gl;
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(
        "ERROR compiling shader!",
        this.gl.getShaderInfoLog(shader)
      );
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error(
        "ERROR linking program!",
        this.gl.getProgramInfoLog(program)
      );
      this.gl.deleteProgram(program);
      return null;
    }
    this.program = program;
  }

  attribLocation() {
    this.attribLocation = this.gl.getAttribLocation(this.program, "a_position");
    return this.gl.getAttribLocation(this.program, "a_position");
  }

  createAndBindBuffer() {
    const positionBuffer = this.gl.createBuffer();
    this.positionBuffer = positionBuffer;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
  }

  bufferData(positions) {
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );
  }

  setViewPort() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  clear() {
    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  useProgramAndEnableVertex() {
    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(this.attribLocation);
  }

  bindBuffer() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
  }

  vertexAttribPointer(size, type, normalize, stride, offset) {
    this.gl.vertexAttribPointer(
      this.attribLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );
  }

  draw(primitiveType, count) {
    this.gl.drawArrays(primitiveType, 0, count);
  }
}
