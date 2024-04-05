import { Shape } from "../constant/shape";
import { DrawableObject } from "./object";
import Transformation from "../utils/transformation";
import Matrix, { multiplyMatrices } from "../utils/matrix";
import { Point } from "../model/point";
import { Color } from "../model/color";

export class Line extends DrawableObject {
  // p1 ---- p2
  constructor({
    origin,
    final,
    id,
    transformation,
    canvasCenter,
    fromFile,
  } = {}) {
    super(id, Shape.Line);
    if (!fromFile) {
      this.origin = origin;
      this.final = final;
      this.vertices = [origin];
      this.vertices.push(final);
    } else {
      this.origin = new Point(
        origin.x,
        origin.y,
        new Color(
          origin.color.r,
          origin.color.g,
          origin.color.b,
          origin.color.a
        )
      );
      this.final = new Point(
        final.x,
        final.y,
        new Color(final.color.r, final.color.g, final.color.b, final.color.a)
      );
      this.vertices = [this.origin, this.final];
    }
    this.transformation = transformation;
    this.canvasCenter = canvasCenter;
  }

  getTransformation = () => {
    return this.transformation;
  };

  getShapeType = () => {
    return Shape.Line;
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

    for (let i = 0; i < 2; i++) {
      this.vertices[i].x = resultMatrix[0][i];
      this.vertices[i].y = resultMatrix[1][i];
    }

    this.transformation = newTransformation;

    // this.vertices[0] = transformation.translate(this.origin);
    // this.vertices[1] = transformation.translate(this.final);
  };

  render(gl, positionAttributeLocation, colorAttributeLocation, withBorder) {
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
    gl.enable(gl.BLEND); 
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.LINE_STRIP, 0, points.length / 2);

    if (withBorder) {
      const dotSize = 10;
      const halfDotSize = dotSize / 2;
      const dotVertices = [];
      for (let i = 0; i < this.vertices.length; i++) {
        const vertex = this.vertices[i];
        dotVertices.push(
          vertex.x - halfDotSize,
          vertex.y - halfDotSize,
          vertex.x + halfDotSize,
          vertex.y - halfDotSize,
          vertex.x + halfDotSize,
          vertex.y + halfDotSize,
          vertex.x - halfDotSize,
          vertex.y - halfDotSize,
          vertex.x + halfDotSize,
          vertex.y + halfDotSize,
          vertex.x - halfDotSize,
          vertex.y + halfDotSize
        );
      }
      const dotBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, dotBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(dotVertices),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(positionAttributeLocation);

      const dotColor = [1, 0, 0, 1];
      const dotColors = Array((dotVertices.length / 2) * 4)
        .fill(dotColor)
        .flat();
      const dotColorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, dotColorBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(dotColors),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(colorAttributeLocation);

      for (let i = 0; i < dotVertices.length / 2; i += 6) {
        gl.drawArrays(gl.TRIANGLES, i, 6);
      }
    }
  }

  updateShapes(newSize) {
    // TO DO : Update size line
    console.log(newSize);
  }

  getPoints() {
    return [this.origin, this.final];
  }

  getName() {
    return "Line " + this.id;
  }

  setPivot(x, y) {
    this.pivotX = x - this.origin.x;
    this.pivotY = y - this.origin.y;
  }

  place(x, y) {
    var lenX = this.final.x - this.origin.x;
    var lenY = this.final.y - this.origin.y;
    this.origin.x = x - this.pivotX;
    this.origin.y = y - this.pivotY;
    this.final.x = x + (lenX - this.pivotX);
    this.final.y = y + (lenY - this.pivotY);
  }

  isCorner(x, y) {
    console.log(x, y, this.origin, this.final);
    if (
      x <= this.origin.x + 20 &&
      x >= this.origin.x - 20 &&
      y <= this.origin.y + 20 &&
      y >= this.origin.y - 20
    ) {
      return 0;
    } else if (
      x <= this.final.x + 20 &&
      x >= this.final.x - 20 &&
      y <= this.final.y + 20 &&
      y >= this.final.y - 20
    ) {
      return 1;
    } else {
      return null;
    }
  }

  changeVertex(x, y, id) {
    this.vertices[id].x = x;
    this.vertices[id].y = y;
  }

  isInside(x, y) {
    const distance1 = Math.sqrt(
      (x - this.origin.x) ** 2 + (y - this.origin.y) ** 2
    );
    const distance2 = Math.sqrt(
      (x - this.final.x) ** 2 + (y - this.final.y) ** 2
    );
    const lineLength = Math.sqrt(
      (this.final.x - this.origin.x) ** 2 + (this.final.y - this.origin.y) ** 2
    );

    const epsilon = 1;
    return Math.abs(distance1 + distance2 - lineLength) < epsilon;
  }
}
