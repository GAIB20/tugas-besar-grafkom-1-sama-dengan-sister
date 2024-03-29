import { GLCCommand } from "../glc/glc";
import ModelShader from "../shaders/model";

export default class Renderer {
  constructor(gl) {
    this.shader = new ModelShader(gl);
    this.glc = new GLCCommand(gl);
    this.models = {};
  }

  registerNewModel = (model, id) => {
    if (!this.models[id]) {
      this.models[id] = {
        type: model,
        instances: [],
      };
    }
  };

  addInstance = (instance, id) => {
    this.models[id].instances.push(instance);
  };

  preRender = () => {
    this.glc.viewport();
    this.glc.depthTest(true);
  };

  render = () => {
    this.preRender();
    this.shader.useShader();
    Object.keys(this.models).forEach((model) => {
      this.models[model].type.use(this.shader);
      this.models[model].instances.forEach(() => {
        this.glc.drawTriangles(this.models[model].type.indices.length);
      });
    });
  };
}
