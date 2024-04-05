import { Shape } from "../constant/shape";
import Matrix, { multiplyMatrices } from "../utils/matrix";
import { convertPointToPairs, getIdxXYFromPairArray } from "../utils/misc";
import Transformation from "../utils/transformation";
import { DrawableObject } from "./object";

export class Polygon extends DrawableObject {
  constructor(points, id, transformation, canvasCenter) {
    super(id, Shape.Polygon);
    this.points = points;
    this.vertices = this.points;

    this.transformation = transformation;
    this.canvasCenter = canvasCenter;
    this.convexHull = [];

    this.vertice = points;
  }

  getTransformation = () => {
    return this.transformation;
  };

  setPoints = (points) => {
    this.points = points;
    this.vertices = points;
  };

  getPoints = () => {
    return this.points;
  };

  getShapeType = () => {
    return Shape.Polygon;
  };

  render(gl, positionAttributeLocation, colorAttributeLocation, withBorder) {
    if (this.points.length >= 2) {
      // else is ignored
      var buffer = gl.createBuffer();
      const tempConvexHull = convertPointToPairs(this.points);
      // console.log("BEFORE SORTED", tempConvexHull)
      this.convexHull = this.sortConvexHullForWebGL(tempConvexHull);
      // console.log("CONVEX HULL", this.convexHull);

      // Search for color idx to be sorted too
      var colorIndexArr = []
      for(var i = 0; i < this.convexHull.length; i+=2 ){
        var tempX = this.convexHull[i]
        var tempY = this.convexHull[i+1]
        var getIdx = getIdxXYFromPairArray(tempX, tempY, tempConvexHull)
        colorIndexArr.push(getIdx)
      }

      // BUFFER DATA VERTICES
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


      // Take the order of rendered color from the colorIndexArr
      var renderedcolor = [];
      for (let i = 0; i < colorIndexArr.length; i++) {
        renderedcolor.push(...this.vertices[colorIndexArr[i]].color.toArray());
      }

      // BUFFER DATA COLORS
      var colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(renderedcolor),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(colorAttributeLocation);

      if (this.points.length == 2) {
        // Draw line if only 2 points
        gl.drawArrays(gl.LINE_STRIP, 0, this.points.length / 2);
      } else {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length);
      }

      if (withBorder) {
        const borderPoints = this.convexHull;
        const borderBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, borderBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(borderPoints),
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
  
        const borderColor = [1, 0, 0, 1];
        const borderColors = Array(borderPoints.length / 2)
          .fill(borderColor)
          .flat();
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(borderColors),
          gl.STATIC_DRAW
        );
        gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
  
        gl.drawArrays(gl.LINE_LOOP, 0, borderPoints.length / 2);
  
        const dotSize = 10;
        const halfDotSize = dotSize / 2;
        const dotVertices = [];
        for (let i = 0; i < this.convexHull.length / 2; i++) {
          const x = this.convexHull[i*2];
          const y = this.convexHull[i*2+1];
          dotVertices.push(
            x - halfDotSize,
            y - halfDotSize,
            x + halfDotSize,
            y - halfDotSize,
            x + halfDotSize,
            y + halfDotSize,
            x - halfDotSize,
            y - halfDotSize,
            x + halfDotSize,
            y + halfDotSize,
            x - halfDotSize,
            y + halfDotSize
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
  
        const dotColor = [1, 0, 0, 1]; // Color of the dots
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
  }

  transformShades(transformationInput) {
    if (this.points.length >= 2) {
      // else is ignored
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
      transformationMatrix.getMatrix();
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


  isInside(x, y) {
    let crossings = 0;
    const vertices = this.convexHull;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i*2], yi = vertices[i*2+1];
        const xj = vertices[j*2], yj = vertices[j*2+1];

        const intersect = ((yi > y) != (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) crossings++;
    }

    return crossings % 2 !== 0;
  }

  place(x, y) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].x = x - this.pivot[i*2];
      this.points[i].y = y - this.pivot[i*2+1];
    }
  }

  setPivot(x, y) {
    console.log(this.points.length)
    this.pivot = []
    for (let i = 0; i < this.points.length; i++) {
      this.pivot.push(x - this.points[i].x);
      this.pivot.push(y - this.points[i].y);
    }
  }

  isCorner(x, y) {
    for (let i = 0; i < this.points.length; i++) {
      if (x <= this.points[i].x + 20 && x >= this.points[i].x - 20 && y <= this.points[i].y + 20 && y >= this.points[i].y - 20) {
        return i;
      }
    }
    return null;
  }

  changeVertex(x, y, id) {
    this.points[id].x = x;
    this.points[id].y = y;
  }

  animateRightAndBack() {
    const moveAmount = 100; // Jumlah geser ke kanan dalam piksel
    const duration = 3000; // Durasi animasi dalam milidetik
    let startTime = null;
    let progress = 0;

    var rz_rand = Math.random()   
    var decider = Math.floor(rz_rand*4)

    const animateStep = () => {
      if (!startTime) startTime = Date.now();
      const elapsed = Date.now() - startTime;

      if (elapsed >= duration) {
        console.log("Animation end");
        return; // Hentikan animasi
      }
      progress = (elapsed / duration) * 2; // *2 karena kita pergi dan kembali dalam durasi yang sama
      const currentMove = moveAmount * Math.abs((progress % 2) - 1);


      // Aplikasikan perubahan relatif terhadap posisi awal
      this.points.forEach((vertex) => {
        if (decider % 2 == 0){
          vertex.x =  vertex.initialX 
        } else {
          if (decider == 1){
            vertex.x =  vertex.initialX + currentMove * (progress <= 1 ? 1 : -1); 
          } else {
            vertex.x =  vertex.initialX - currentMove * (progress <= 1 ? 1 : -1); 
          }
        }
        if (decider == 1) {
          vertex.y =  vertex.initialY + currentMove * (progress <= 1 ? 1 : -1);
        } else {
          if (decider <= 2){
            vertex.y =  vertex.initialY + currentMove * (progress <= 1 ? 1 : -1);
          } else {
            vertex.y =  vertex.initialY - currentMove * (progress <= 1 ? 1 : -1);
          }
        }
      });

      window.requestAnimationFrame(animateStep);
    };

    if (!this.points[0].initialX) {
      this.points.forEach((vertex) => {
        vertex.initialX = vertex.x;
        vertex.initialY = vertex.y;
      });
    }

    window.requestAnimationFrame(animateStep); // Jadwalkan iterasi selanjutnya
  }
}
