import { Shape } from "../constant/shape";
import { Point } from "../model/point";
import Matrix, { multiplyMatrices } from "../utils/matrix";
import Transformation from "../utils/transformation";
import { DrawableObject } from "./object";

const REFERENCE_POINT = [0, 0];

export class Polygon extends DrawableObject {
  constructor(points, color, id, transformation, canvasCenter) {
    super(id, Shape.Polygon, color);
    this.points = points;
    this.colorPoints = color;
    this.transformation = transformation;
    this.canvasCenter = canvasCenter;
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
    var buffer = gl.createBuffer();
    // const points = this.convertPointToCoordinates(this.points);
    const pointPairs = this.convertPointToPairs(this.points);
    // console.log(pointPairs);

    // Make ConvexHull
    const convexHullPairs = this.convexHull(pointPairs);
    // console.log("CONVEX HULL", convexHullPairs);

    const orderedConvexHull = this.sortConvexHullForWebGL(convexHullPairs);
    console.log(orderedConvexHull);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(orderedConvexHull),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
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

  convertPointToCoordinates = (points) => {
    const results = [];
    for (let i = 0; i < points.length; i++) {
      results.push(points[i].x, points[i].y);
    }
    return results;
  };

  convertPointToPairs = (points) => {
    // From Point data type to [x, y]
    const results = [];
    for (let i = 0; i < points.length; i++) {
      results.push([points[i].x, points[i].y]);
    }
    return results;
  };

  convertPairsToCoordinates = (points) => {
    // From data type [[x, y],[z,..]] to [x, y, z, ..]
    const results = [];
    for (let i = 0; i < points.length; i++) {
      results.push(points[i][0], points[i][1]);
    }
    return results;
  };

  transformShades(transformationInput) {
    // const centerX = (this.p1.x + this.p4.x) / 2;
    // const centerY = (this.p1.y + this.p4.y) / 2;
    // const newTransformation = new Transformation(
    //   transformationInput.x,
    //   transformationInput.y,
    //   transformationInput.rz,
    //   transformationInput.rvz,
    //   transformationInput.sx,
    //   transformationInput.sy,
    //   transformationInput.shx,
    //   transformationInput.shy
    // );
    // this.transformation.difference(newTransformation);
    // var transformationMatrix =
    //   this.transformation.calculateTransformationMatrix(
    //     centerX,
    //     centerY,
    //     this.canvasCenter[0],
    //     this.canvasCenter[1]
    //   );
    // var shapeMatrix = new Matrix(4, 4);
    // var tempVertices0 = [this.p1.x, this.p1.y, 0, 1];
    // var tempVertices1 = [this.p2.x, this.p2.y, 0, 1];
    // var tempVertices2 = [this.p3.x, this.p3.y, 0, 1];
    // var tempVertices3 = [this.p4.x, this.p4.y, 0, 1];
    // var tempMatrix = [
    //   tempVertices0,
    //   tempVertices1,
    //   tempVertices2,
    //   tempVertices3,
    // ];
    // shapeMatrix.insertMatrix(tempMatrix);
    // shapeMatrix.transpose();
    // var resultMatrix = multiplyMatrices(
    //   transformationMatrix.getMatrix(),
    //   shapeMatrix.getMatrix()
    // );
    // // console.log(resultMatrix);
    // for (let i = 0; i < 4; i++) {
    //   this.vertices[i].x = resultMatrix[0][i];
    //   this.vertices[i].y = resultMatrix[1][i];
    // }
    // this.transformation = newTransformation;
  }

  updateShapes(newSize) {
    // // Hitung titik tengah
    // const centerX = (this.p4.x + this.p1.x) / 2;
    // const centerY = (this.p1.y + this.p4.y) / 2;
    // const halfSize = newSize / 2;
    // // Posisikan ulang titik sudut
    // this.p1 = new Point(centerX - halfSize, centerY - halfSize);
    // this.p2 = new Point(centerX - halfSize, centerY + halfSize);
    // this.p3 = new Point(centerX + halfSize, centerY - halfSize);
    // this.p4 = new Point(centerX + halfSize, centerY + halfSize);
    // // Memperbarui vertices dan distance
    // this.vertices = [this.p1, this.p2, this.p3, this.p4];
    // this.distance = newSize;
  }

  getName() {
    return "Polygon" + this.id;
  }

  // ========= CONVEX HULL ==============

  // Method to find the convex hull using the Divide and Conquer Algorithm
  convexHull(points) {
    if (points.length < 3) {
      return points;
    }

    points.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));

    const upper = [];
    const lower = [];

    for (const point of points) {
      while (
        upper.length >= 2 &&
        this.isNotRightTurn(
          upper[upper.length - 2],
          upper[upper.length - 1],
          point
        )
      ) {
        upper.pop();
      }
      upper.push(point);
    }

    for (let i = points.length - 1; i >= 0; i--) {
      const point = points[i];
      while (
        lower.length >= 2 &&
        this.isNotRightTurn(
          lower[lower.length - 2],
          lower[lower.length - 1],
          point
        )
      ) {
        lower.pop();
      }
      lower.push(point);
    }

    const hull = new Set([...upper, ...lower]);
    return Array.from(hull);
  }

  // Function to check the correct direction
  isNotRightTurn(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) <= 0;
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
}
