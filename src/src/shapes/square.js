import { Shape } from "../constant/shape";
import { Point } from "../model/point";
import Matrix, { multiplyMatrices } from "../utils/matrix";
import Transformation from "../utils/transformation";
import { DrawableObject } from "./object";

export class Square extends DrawableObject {
  // p1 ---- p3
  // |        |
  // p2 ---- p4
  constructor(origin, final, color, id) {
    super(id, Shape.Square, color);
    this.vertices = [origin];
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
      transformationInput.rz,
      transformationInput.sx,
      transformationInput.sy,
      transformationInput.shx,
      transformationInput.shy
    );

    console.log(this.vertices);

    var transformationMatrix = transformation.calculateTransformationMatrix();
    transformationMatrix.printMatrix();

    var shapeMatrix = new Matrix(4, 4);
    var tempVertices0 = [
      this.vertices[0].x,
      this.vertices[0].y,
      0,
      1,
    ];
    var tempVertices1 = [
      this.vertices[1].x,
      this.vertices[1].y,
      0,
      1,
    ];
    var tempVertices2 = [
      this.vertices[2].x,
      this.vertices[2].y,
      0,
      1,
    ];
    var tempVertices3 = [
      this.vertices[3].x,
      this.vertices[3].y,
      0,
      1,
    ];
    var tempMatrix = [
      tempVertices0,
      tempVertices1,
      tempVertices2,
      tempVertices3,
    ];

    shapeMatrix.insertMatrix(tempMatrix);
    shapeMatrix.transpose();

    var resultMatrix = multiplyMatrices(
      transformationMatrix.getMatrix(),
      shapeMatrix.getMatrix()
    );
    console.log(resultMatrix);

    for (let i = 0; i < 4; i++) {
      this.vertices[i].x = resultMatrix[0][i];
      this.vertices[i].y = resultMatrix[1][i];
    }

    // console.log(this.vertices);

    // this.vertices[0] = transformation.translate(this.p1);
    // this.vertices[1] = transformation.translate(this.p2);
    // this.vertices[2] = transformation.translate(this.p3);
    // this.vertices[3] = transformation.translate(this.p4);
  }

  getName() {
    return "Square " + this.id;
  }
}
