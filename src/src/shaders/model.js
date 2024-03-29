import { GLCCommand } from "../glc/glc";
import fragmentSource from "../init/fragment_shader";
import vertexSource from "../init/vertex_shader";

export default class ModelShader {
  constructor(gl) {
    this.gl = new GLCCommand(gl);
    const vertexShader = this.gl.createVertexShader();
    
    console.log(vertexShader,vertexSource)
    this.gl.addShaderSource(vertexShader, vertexSource);
    this.gl.compileShader(vertexShader);

    
    const fragmentShader = this.gl.createFragmentShader();
    this.gl.addShaderSource(fragmentShader, fragmentSource);
    this.gl.compileShader(fragmentShader);

    const program = this.gl.createShaderProgram();
    this.gl.attachShaderToProgram(program, vertexShader);
    this.gl.attachShaderToProgram(program, fragmentShader);
    this.gl.linkProgram(program);

    this.positionAttribute = this.gl.getAttribLocation(
      program,
      "a_position"
    );
    this.program = program;
  }

  useShader = () => {
    this.gl.useProgram(this.program);
  };

  enablePosition = () => {
    this.gl.enableVertexAttribArray(this.positionAttribute);
    this.gl.pointToAttribute(this.positionAttribute, 3)
  };


}
