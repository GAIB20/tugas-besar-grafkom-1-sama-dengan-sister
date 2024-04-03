import { Point } from "../model/point";
import Transformation from "../utils/transformation";

export class Square {
  // p1 ---- p3
  // |        |
  // p2 ---- p4
  constructor(origin, final, color, id) {
    this.color = color;
    this.vertices = [origin];
    if (id) {
      this.id = id;
    }
    const distance =
      Math.abs(origin.x - final.x) > Math.abs(origin.y - final.y)
        ? Math.abs(origin.x - final.x)
        : Math.abs(origin.y - final.y);
    const newX = origin.x > final.x ? origin.x - distance : origin.x + distance;
    const newY = origin.y > final.y ? origin.y - distance : origin.y + distance;
    final.updatePoint(newX, newY);
    const p2 = new Point(origin.x, final.y);
    const p3 = new Point(final.x, origin.y);
    this.p1 = origin;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = final;
    this.vertices.push(p2);
    this.vertices.push(p3);
    this.vertices.push(final);
  }

  convertPointToCoordinates = () => {
    const results = [];
    for (let i = 0; i < this.vertices.length; i++) {
      results.push(this.vertices[i].x, this.vertices[i].y);
    }
    return results;
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
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, points.length / 2);
  }

  updateShapes(transformationInput) {
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
    this.vertices[0] = transformation.translate(this.p1);
    this.vertices[1] = transformation.translate(this.p2);
    this.vertices[2] = transformation.translate(this.p3);
    this.vertices[3] = transformation.translate(this.p4);
  }

  getName() {
    return "Square " + this.id;
  }
}
