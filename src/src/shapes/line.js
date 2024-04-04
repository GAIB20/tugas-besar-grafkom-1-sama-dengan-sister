import { Shape } from "../constant/shape";
import { DrawableObject } from "./object";
import Transformation from "../utils/transformation";

export class Line extends DrawableObject {
  // p1 ---- p2
  constructor(origin, final, color, id) {
    super(id, Shape.Line, color);
    this.color = color;
    this.origin = origin;
    this.final = final;
    this.vertices = [origin];
    this.vertices.push(final);
  }

  convertPointToCoordinates = () => {
    const results = [];
    for (let i = 0; i < this.vertices.length; i++) {
      results.push(this.vertices[i].x);
      results.push(this.vertices[i].y);
    }
    return results;
  };

  transformShades = (transformationInput) => {
    const transformation = new Transformation(
      transformationInput.x,
      transformationInput.y,
      transformationInput.rx,
      transformationInput.ry,
      transformationInput.sx,
      transformationInput.sy,
      transformationInput.shx,
      transformationInput.shy
    );
    this.vertices[0] = transformation.translate(this.origin);
    this.vertices[1] = transformation.translate(this.final);
  };

  render(gl, positionAttributeLocation, colorAttributeLocation) {
    var buffer = gl.createBuffer();
    const points = this.convertPointToCoordinates();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttributeLocation);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.color),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.drawArrays(gl.LINE_STRIP, 0, points.length / 2);
  }

  updateShapes(newSize) {
    // TO DO : Update size line
    console.log(newSize);
  }

  getPoints() {
    return [this.origin, this.final];
  }
}
