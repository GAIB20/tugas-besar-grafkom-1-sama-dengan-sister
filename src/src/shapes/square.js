import { Shape } from "../constant/shape";
import { Point } from "../model/point";
import Matrix, { multiplyMatrices } from "../utils/matrix";
import Transformation from "../utils/transformation";
import { DrawableObject } from "./object";

export class Square extends DrawableObject {
  // p1 ---- p3
  // |        |
  // p2 ---- p4
  constructor(origin, final, color, id, transformation) {
    super(id, Shape.Square, color);

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

    this.vertices = [origin];
    this.vertices.push(p2);
    this.vertices.push(p3);
    this.vertices.push(final);

    this.transformation = transformation
  }

  getTransformation = () => {
    return this.transformation;
  };

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
    const newTransformation = new Transformation(
      transformationInput.x,
      transformationInput.y,
      transformationInput.rz,
      transformationInput.rvz,
      transformationInput.sx,
      transformationInput.sy,
      transformationInput.shx,
      transformationInput.shy
    );

    this.transformation.difference(newTransformation)

    var transformationMatrix = this.transformation.calculateTransformationMatrix();
    // transformationMatrix.printMatrix();

    var shapeMatrix = new Matrix(4, 4);
    var tempVertices0 = [this.p1.x, this.p1.y, 0, 1];
    var tempVertices1 = [this.p2.x, this.p2.y, 0, 1];
    var tempVertices2 = [this.p3.x, this.p3.y, 0, 1];
    var tempVertices3 = [this.p4.x, this.p4.y, 0, 1];
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

    this.transformation = newTransformation
  }

  getName() {
    return "Square " + this.id;
  }
}
