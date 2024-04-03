
// Create a shader object, upload the source and compile the shader.
export const createShader=(gl, type, source) =>{
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

// Create the shader program.
export const createProgram = (gl, vertexShader, fragmentShader)=> {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(program)
    );
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(program)
    );
    gl.deleteProgram(program);
    return null;
  }
  return program;
}
