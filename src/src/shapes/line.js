import { Shape } from "../constant/shape";
import { DrawableObject } from "./object";
import Transformation from "../utils/transformation";
import Matrix, { multiplyMatrices } from "../utils/matrix";

export class Line extends DrawableObject {
  // p1 ---- p2
  constructor(origin, final, color, id, transformation, canvasCenter) {
    super(id, Shape.Line, color);
    this.color = color;
    this.origin = origin;
    this.final = final;
    this.vertices = [origin];
    this.vertices.push(final);

    this.transformation = transformation;
    this.canvasCenter = canvasCenter;
  }

  getTransformation = () => {
    return this.transformation;
  };

  convertPointToCoordinates = () => {
    const results = [];
    for (let i = 0; i < this.vertices.length; i++) {
      results.push(this.vertices[i].x);
      results.push(this.vertices[i].y);
    }
    return results;
  };

  transformShades = (transformationInput) => {
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
    const centerX = (this.origin.x + this.final.x) / 2;
    const centerY = (this.origin.y + this.final.y) / 2;

    this.transformation.difference(newTransformation);

    var transformationMatrix =
      this.transformation.calculateTransformationMatrix(
        centerX,
        centerY,
        this.canvasCenter[0],
        this.canvasCenter[1]
      );

    var shapeMatrix = new Matrix(2, 4);
    var tempVertices0 = [this.origin.x, this.origin.y, 0, 1];
    var tempVertices1 = [this.final.x, this.final.y, 0, 1];
    var tempMatrix = [tempVertices0, tempVertices1];

    shapeMatrix.insertMatrix(tempMatrix);
    shapeMatrix.transpose();

    var resultMatrix = multiplyMatrices(
      transformationMatrix.getMatrix(),
      shapeMatrix.getMatrix()
    );

    for (let i = 0; i < 2; i++){
      this.vertices[i].x = resultMatrix[0][i];
      this.vertices[i].y = resultMatrix[1][i];
    }

    this.transformation = newTransformation;

    // this.vertices[0] = transformation.translate(this.origin);
    // this.vertices[1] = transformation.translate(this.final);
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
}
