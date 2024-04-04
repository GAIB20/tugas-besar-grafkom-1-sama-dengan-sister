import { Shape } from "../constant/shape";
import { Point } from "../model/point";
import Matrix, { multiplyMatrices } from "../utils/matrix";
import Transformation from "../utils/transformation";
import { DrawableObject } from "./object";

export class Rectangle extends DrawableObject {
  //  p1 --------- p2
  //  |            |
  //  p4 --------- p3
  
  constructor(origin, final, color, id, transformation) {
    console.log("Ini origin dan final di dalme", origin, final)
    super(id, Shape.Rectangle, color);

    const p2 = new Point(origin.x, final.y);
    const p4 = new Point(final.x, origin.y);
    this.p1 = origin;
    this.p2 = p2;
    this.p3 = final;
    this.p4 = p4;

    this.vertices = [origin];
    this.vertices.push(p2, final, p4);
    this.color = color;
    this.transformation = transformation;
    this.length = Math.abs(this.p1.x - this.p3.x);
    this.width = Math.abs(this.p1.y - this.p3.y);
  }
  getTransformation = () => {
    return this.transformation;
  };
  transformShades(transformationInput) {
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

    this.transformation.difference(newTransformation);
    console.log("Ini new trans : ", newTransformation)
    var transformationMatrix =
      this.transformation.calculateTransformationMatrix();
    // transformationMatrix.printMatrix();
    console.log("Ini trans mat : ", transformationMatrix)
    console.log("Ini vertices : ", this.vertices)
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
    console.log("Ini temp matrix : ", tempMatrix)
    shapeMatrix.insertMatrix(tempMatrix);
    shapeMatrix.transpose();
    console.log("Ini shape matrix : ", shapeMatrix)
    var resultMatrix = multiplyMatrices(
      transformationMatrix.getMatrix(),
      shapeMatrix.getMatrix()
    );
    console.log("Ini result matrix : ",resultMatrix);

    for (let i = 0; i < 4; i++) {
      this.vertices[i].x = resultMatrix[0][i];
      this.vertices[i].y = resultMatrix[1][i];
    }

    this.transformation = newTransformation;
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
    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 2);
  }

  updateShapes(newSize) {
    const newWidth = newSize.width
    const newLength = newSize.length
    // Hitung titik tengah
    const centerX = (this.p1.x + this.p3.x) / 2;
    const centerY = (this.p1.y + this.p3.y) / 2;

    // Setengah dari width dan length baru
    const halfNewWidth = newWidth / 2;
    const halfNewLength = newLength / 2;

    // Tetapkan ulang titik sudut berdasarkan titik tengah dan setengah dari width dan length baru
    this.p1 = new Point(centerX - halfNewLength, centerY - halfNewWidth);
    this.p2 = new Point(centerX + halfNewLength, centerY - halfNewWidth);
    this.p3 = new Point(centerX + halfNewLength, centerY + halfNewWidth);
    this.p4 = new Point(centerX - halfNewLength, centerY + halfNewWidth);

    this.vertices = [this.p1, this.p2, this.p3, this.p4];

    this.width = newWidth;
    this.length = newLength;
  }

  getName(){
    return "Rectangle " + this.id
  }
}
