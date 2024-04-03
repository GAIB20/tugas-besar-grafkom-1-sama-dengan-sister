import { Point } from "../model/point";

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
    this.vertices.push(p2);
    this.vertices.push(p3);
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

  getName() {
    return "Square " + this.id;
  }
}
