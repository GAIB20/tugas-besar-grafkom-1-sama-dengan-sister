export class GLCCommand {
  constructor(gl) {
    console.log("Ini gl di param :", gl);
    this.gl = gl;
  }

  clear = (r, g, b, a) => {
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  };

  viewport = () => {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  };
  depthTest = (use) => {
    use
      ? this.gl.enable(this.gl.DEPTH_TEST)
      : this.gl.disable(this.gl.DEPTH_TEST);
  };

  createBuffer = () => {
    return this.gl.createBuffer();
  };

  // float buffers

  bindArrayBuffer = (buffer) => {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  };
  unbindArrayBuffer = () => {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  };
  addArrayBufferData = (vertices) => {
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );
  };

  bindElementArrayBuffer = (buffer) => {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
  };
  unbindElementArrayBuffer = () => {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  };

  addElementArrayBufferData = (indices) => {
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );
  };

  // shader functions

  createVertexShader = () => {
    return this.gl.createShader(this.gl.VERTEX_SHADER);
  };
  createFragmentShader = () => {
    return this.gl.createShader(this.gl.FRAGMENT_SHADER);
  };

  addShaderSource = (shader, source) => {
    this.gl.shaderSource(shader, source);
  };
  compileShader = (shader) => {
    this.gl.compileShader(shader);
  };
  createShaderProgram = () => {
    return this.gl.createProgram();
  };
  attachShaderToProgram = (program, shader) => {
    this.gl.attachShader(program, shader);
  };
  linkProgram = (program) => {
    this.gl.linkProgram(program);
  };
  useProgram = (program) => {
    this.gl.useProgram(program);
  };

  getAttribLocation = (program, attribute) => {
    return this.gl.getAttribLocation(program, attribute);
  };
  enableVertexAttribArray = (attribute) => {
    this.gl.enableVertexAttribArray(attribute);
  };
  pointToAttribute = (data, dimensions) => {
    this.gl.vertexAttribPointer(data, dimensions, this.gl.FLOAT, false, 0, 0);
  };

  drawTriangles = (noOfIndices) =>
    this.gl.drawElements(
      this.gl.TRIANGLES,
      noOfIndices,
      this.gl.UNSIGNED_SHORT,
      0
    );
}
