import { Shape } from "../constant/shape";
import { Color } from "../model/color";
import { Point } from "../model/point";
import Matrix, { multiplyMatrices } from "../utils/matrix";
import { convertPointToPairs } from "../utils/misc";
import Transformation from "../utils/transformation";
import { DrawableObject } from "./object";


export class Polygon extends DrawableObject {
  constructor(points, color, id, transformation, canvasCenter) {
    super(id, Shape.Polygon, color);
    this.points = points;
    this.colorPoints = color;
    this.vertices = this.points;

    this.transformation = transformation;
    this.canvasCenter = canvasCenter;
    this.convexHull = [];

    this.vertice = []
    for (let i = 0; i < points.length; i++){
      this.vertice[i] = new Point(this.points[i].x, this.points[i].y, new Color(0, 0, 0, 1))
    }
  }

  getTransformation = () => {
    return this.transformation;
  };

  setPoints = (points) => {
    this.points = points;

  };

  getPoints = () => {
    return this.points;
  };

  setColorPoints = (colorPoints) => {
    this.colorPoints = colorPoints;
  };

  getColorPoints = () => {
    return this.colorPoints;
  };

  getShapeType = () => {
    return Shape.Polygon;
  };

  render(gl, positionAttributeLocation, colorAttributeLocation) {
    if (this.points.length >= 3) { // else is ignored
      var buffer = gl.createBuffer();
      const tempConvexHull = convertPointToPairs(this.points);
      this.convexHull = this.sortConvexHullForWebGL(tempConvexHull);
      // console.log(this.convexHull);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(this.convexHull),
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

      var colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(this.colorPoints),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(colorAttributeLocation);

      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length);
    }
  }


  transformShades(transformationInput) {
    if (this.points.length >= 3) { // else is ignored
      const centroid = this.findCentroid();
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
          centroid[0],
          centroid[1],
          this.canvasCenter[0],
          this.canvasCenter[1]
        );
      transformationMatrix.getMatrix()
      var shapeMatrix = new Matrix(this.points.length, 4);
      var tempMatrix = [];
      for (var i = 0; i < this.points.length; i++) {
        var tempVertices = [this.points[i].x, this.points[i].y, 0, 1];
        tempMatrix.push(tempVertices);
      }
      shapeMatrix.insertMatrix(tempMatrix);
      shapeMatrix.transpose();
      var resultMatrix = multiplyMatrices(
        transformationMatrix.getMatrix(),
        shapeMatrix.getMatrix()
      );



      for (let i = 0; i < this.points.length; i++) {
        this.points[i].x = resultMatrix[0][i];
        this.points[i].y = resultMatrix[1][i];
      }
      this.transformation = newTransformation;
      this.vertices = this.points;
    }
  }



  getName() {
    return "Polygon" + this.id;
  }



  // // ======== SORTING ALGORITHM =============

  sortConvexHullForWebGL(convexHullVertices) {
    // Calculate the centroid
    let centroidX = 0;
    let centroidY = 0;
    for (let i = 0; i < convexHullVertices.length; i++) {
      centroidX += convexHullVertices[i][0];
      centroidY += convexHullVertices[i][1];
    }
    centroidX /= convexHullVertices.length;
    centroidY /= convexHullVertices.length;

    // Pair vertices with their angles relative to centroid
    const verticesWithAngles = convexHullVertices.map((vertex) => {
      const angle = Math.atan2(vertex[1] - centroidY, vertex[0] - centroidX);
      return { vertex, angle };
    });

    // Sort vertices based on angles
    verticesWithAngles.sort((a, b) => a.angle - b.angle);

    // Create a new Float32Array for sorted vertices
    const sortedVertices = new Array(convexHullVertices.length * 2);

    // Fill sorted vertices array with sorted vertex coordinates
    for (let i = 0; i < verticesWithAngles.length; i++) {
      sortedVertices[i * 2] = verticesWithAngles[i].vertex[0];
      sortedVertices[i * 2 + 1] = verticesWithAngles[i].vertex[1];
    }

    return sortedVertices;
  }

  findCentroid() {
    let centroidX = 0;
    let centroidY = 0;
    const n = this.points.length;

    // Calculate the sum of x and y coordinates
    for (let i = 0; i < n; i++) {
      centroidX += this.points[i].x;
      centroidY += this.points[i].y;
    }

    // Calculate the average of x and y coordinates
    centroidX /= n;
    centroidY /= n;

    return [centroidX, centroidY];
  }
}
