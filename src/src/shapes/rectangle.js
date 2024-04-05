import { Shape } from "../constant/shape";
import { Point } from "../model/point";
import Matrix, { multiplyMatrices } from "../utils/matrix";
import Transformation from "../utils/transformation";
import { DrawableObject } from "./object";
import { Color } from "../model/color";

export class Rectangle extends DrawableObject {
  //  p1 --------- p2
  //  |            |
  //  p4 --------- p3

  constructor({
    origin = null,
    final = null,
    color = [],
    id = null,
    transformation = null,
    canvasCenter = null,
    fromFile = false,
    vertices = [],
  }) {
    super(id, Shape.Rectangle, color);
    if (!fromFile) {
      const p2 = new Point(
        origin.x,
        final.y,
        new Color(
          origin.color.r,
          origin.color.g,
          origin.color.b,
          origin.color.a
        )
      );
      const p4 = new Point(
        final.x,
        origin.y,
        new Color(final.color.r, final.color.g, final.color.b, final.color.a)
      );
      this.p1 = origin;
      this.p2 = p2;
      this.p3 = final;
      this.p4 = p4;

      this.vertices = [origin];
      this.vertices.push(p2, final, p4);
    } else {
      this.vertices = [];
      for (let i = 0; i < vertices.length; i++) {
        this.vertices[i] = new Point(
          vertices[i].x,
          vertices[i].y,
          new Color(
            vertices[i].color.r,
            vertices[i].color.g,
            vertices[i].color.b,
            vertices[i].color.a
          )
        );
      }
      this.p1 = this.vertices[0];
      this.p2 = this.vertices[1];
      this.p3 = this.vertices[2];
      this.p4 = this.vertices[3];
    }

    this.color = color;
    this.transformation = transformation;
    this.length = Math.abs(this.p1.x - this.p3.x);
    this.width = Math.abs(this.p1.y - this.p3.y);
    this.canvasCenter = canvasCenter;
  }
  getTransformation = () => {
    return this.transformation;
  };

  getShapeType = () => {
    return Shape.Rectangle;
  };

  transformShades(transformationInput) {
    const centerX = (this.p1.x + this.p3.x) / 2;
    const centerY = (this.p1.y + this.p3.y) / 2;
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
    var transformationMatrix =
      this.transformation.calculateTransformationMatrix(
        centerX,
        centerY,
        this.canvasCenter[0],
        this.canvasCenter[1]
      );
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

    var renderedcolor = [];
    for (let i = 0; i < this.vertices.length; i++) {
      renderedcolor.push(...this.vertices[i].color.toArray());
    }

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(renderedcolor),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 2);
  }

  updateShapes(newSize) {
    const newWidth = newSize.width;
    const newLength = newSize.length;
    // Hitung titik tengah
    const centerX = (this.p1.x + this.p3.x) / 2;
    const centerY = (this.p1.y + this.p3.y) / 2;

    // Setengah dari width dan length baru
    const halfNewWidth = newWidth / 2;
    const halfNewLength = newLength / 2;
    // Tetapkan ulang titik sudut berdasarkan titik tengah dan setengah dari width dan length baru
    this.p1 = new Point(
      centerX - halfNewLength,
      centerY - halfNewWidth,
      new Color(
        this.p1.color.r,
        this.p1.color.g,
        this.p1.color.b,
        this.p1.color.a
      )
    );
    this.p2 = new Point(
      centerX + halfNewLength,
      centerY - halfNewWidth,
      new Color(
        this.p2.color.r,
        this.p2.color.g,
        this.p2.color.b,
        this.p2.color.a
      )
    );
    this.p3 = new Point(
      centerX + halfNewLength,
      centerY + halfNewWidth,
      new Color(
        this.p3.color.r,
        this.p3.color.g,
        this.p3.color.b,
        this.p3.color.a
      )
    );
    this.p4 = new Point(
      centerX - halfNewLength,
      centerY + halfNewWidth,
      new Color(
        this.p4.color.r,
        this.p4.color.g,
        this.p4.color.b,
        this.p4.color.a
      )
    );

    this.vertices = [this.p1, this.p2, this.p3, this.p4];

    this.width = newWidth;
    this.length = newLength;
    this.transformation = new Transformation(
      this.transformation.tx,
      this.transformation.ty,
      0,
      0,
      0,
      0,
      0,
      0
    );
  }

  getName() {
    return "Rectangle " + this.id;
  }

  getPoints() {
    return [this.p1, this.p2, this.p3, this.p4];
  }
}
