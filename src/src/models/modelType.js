import { GLCCommand } from "../glc/glc";

export class ModelType {
  constructor(vertices, indices, gl) {
    this.glc = new GLCCommand(gl);
    this.vertices = vertices;
    this.indices = indices;
    this.generateVertexShader();
    this.generateIndexShader();
  }

  generateVertexShader = () => {
    this.vertexBuffer = this.glc.createBuffer();
    this.glc.bindArrayBuffer(this.vertexBuffer);
    this.glc.addArrayBufferData(this.vertices);
    this.glc.unbindArrayBuffer();
  };

  generateIndexShader = () => {
    this.indexBuffer = this.glc.createBuffer();
    this.glc.bindElementArrayBuffer(this.indexBuffer);
    this.glc.addElementArrayBufferData(this.indices);
    this.glc.unbindElementArrayBuffer();
  };

  use = (shader) => {
    this.glc.bindArrayBuffer(this.vertexBuffer);
    shader.enablePosition();
    this.glc.bindElementArrayBuffer(this.indexBuffer);
  };
}
