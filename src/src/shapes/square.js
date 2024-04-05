import { Shape } from "../constant/shape";
import { Point } from "../model/point";
import Matrix, { multiplyMatrices } from "../utils/matrix";
import Transformation from "../utils/transformation";
import { DrawableObject } from "./object";
import { Color } from "../model/color";

export class Square extends DrawableObject {
  // p1 ---- p3
  // |        |
  // p2 ---- p4
  constructor({
    origin = null,
    final = null,
    id = null,
    transformation = null,
    canvasCenter = null,
    fromFile = false,
    vertices = [],
  } = {}) {
    super(id, Shape.Square);
    if (!fromFile) {
      const distance =
        Math.abs(origin.x - final.x) > Math.abs(origin.y - final.y)
          ? Math.abs(origin.x - final.x)
          : Math.abs(origin.y - final.y);
      this.distance = distance;
      const newX =
        origin.x > final.x ? origin.x - distance : origin.x + distance;
      const newY =
        origin.y > final.y ? origin.y - distance : origin.y + distance;
      final.updatePoint(newX, newY);

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
      const p3 = new Point(
        final.x,
        origin.y,
        new Color(final.color.r, final.color.g, final.color.b, final.color.a)
      );

      this.p1 = origin;
      this.p2 = p2;
      this.p3 = p3;
      this.p4 = final;

      this.vertices = [origin];
      this.vertices.push(p2);
      this.vertices.push(p3);
      this.vertices.push(final);

      this.transformation = transformation;
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
    this.transformation = transformation;
    this.canvasCenter = canvasCenter;
  }

  getTransformation = () => {
    return this.transformation;
  };

  getShapeType = () => {
    return Shape.Square;
  };

  convertPointToCoordinates = () => {
    const results = [];
    for (let i = 0; i < this.vertices.length; i++) {
      results.push(this.vertices[i].x, this.vertices[i].y);
    }
    return results;
  };
  
  calculateBorderPoints() {
    const results = [];

    results.push(this.vertices[0].x, this.vertices[0].y);
    results.push(this.vertices[1].x, this.vertices[1].y);
    results.push(this.vertices[3].x, this.vertices[3].y);
    results.push(this.vertices[2].x, this.vertices[2].y);

    return results;
}


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
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, points.length / 2);

    if (withBorder) {
      const borderPoints = this.calculateBorderPoints(); 
      const borderBuffer = gl.createBuffer(); 
      gl.bindBuffer(gl.ARRAY_BUFFER, borderBuffer); 
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(borderPoints), gl.STATIC_DRAW); 
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0); 

      const borderColor = [1, 0, 0, 1]; 
      const borderColors = Array(borderPoints.length / 2).fill(borderColor).flat(); 
      const colorBuffer = gl.createBuffer(); 
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer); 
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(borderColors), gl.STATIC_DRAW); 
      gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0); 

      gl.drawArrays(gl.LINE_LOOP, 0, borderPoints.length / 2);

      const dotSize = 10;
      const halfDotSize = dotSize / 2;
      const dotVertices = [];
      for (let i = 0; i < this.vertices.length; i++) {
          const vertex = this.vertices[i];
          dotVertices.push(
              vertex.x - halfDotSize, vertex.y - halfDotSize,
              vertex.x + halfDotSize, vertex.y - halfDotSize,
              vertex.x + halfDotSize, vertex.y + halfDotSize,
              vertex.x - halfDotSize, vertex.y - halfDotSize,
              vertex.x + halfDotSize, vertex.y + halfDotSize,
              vertex.x - halfDotSize, vertex.y + halfDotSize
          );
      }
      const dotBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, dotBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotVertices), gl.STATIC_DRAW);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionAttributeLocation);

      const dotColor = [1, 0, 0, 1]; // Color of the dots
      const dotColors = Array(dotVertices.length / 2 * 4).fill(dotColor).flat();
      const dotColorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, dotColorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotColors), gl.STATIC_DRAW);
      gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(colorAttributeLocation);

      for (let i = 0; i < dotVertices.length / 2; i += 6) {
          gl.drawArrays(gl.TRIANGLES, i, 6);
      }
    }
  }

  transformShades(transformationInput) {
    const centerX = (this.p1.x + this.p4.x) / 2;
    const centerY = (this.p1.y + this.p4.y) / 2;
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
    // console.log(resultMatrix);

    for (let i = 0; i < 4; i++) {
      this.vertices[i].x = resultMatrix[0][i];
      this.vertices[i].y = resultMatrix[1][i];
    }

    this.transformation = newTransformation;
  }

  place(x, y) {
    this.p1.x = x - this.pivotX1;
    this.p1.y = y - this.pivotY1;
    this.p2.x = x - this.pivotX2;
    this.p2.y = y - this.pivotY2;
    this.p3.x = x - this.pivotX3;
    this.p3.y = y - this.pivotY3;
    this.p4.x = x - this.pivotX4;
    this.p4.y = y - this.pivotY4;
  }

  isCorner(x, y) {
    if (x <= this.p1.x + 20 && x >= this.p1.x - 20 && y <= this.p1.y + 20 && y >= this.p1.y - 20) {
      return 0;
    } else if (x <= this.p2.x + 20 && x >= this.p2.x - 20 && y <= this.p2.y + 20 && y >= this.p2.y - 20) {
      return 1;
    } else if (x <= this.p3.x + 20 && x >= this.p3.x - 20 && y <= this.p3.y + 20 && y >= this.p3.y - 20) {
      return 2;
    } else if (x <= this.p4.x + 20 && x >= this.p4.x - 20 && y <= this.p4.y + 20 && y >= this.p4.y - 20) {
      return 3;
    } else {
      return null;
    }
  }

  changeVertex(x, y, id) {
    this.vertices[id].x = x;
    this.vertices[id].y = y;
  }


  updateShapes(newSize) {
    // Hitung titik tengah
    const centerX = (this.p4.x + this.p1.x) / 2;
    const centerY = (this.p1.y + this.p4.y) / 2;
    const halfSize = newSize / 2;

    // Posisikan ulang titik sudut
    this.p1 = new Point(
      centerX - halfSize,
      centerY - halfSize,
      new Color(
        this.p1.color.r,
        this.p1.color.g,
        this.p1.color.b,
        this.p1.color.a
      )
    );
    this.p2 = new Point(
      centerX - halfSize,
      centerY + halfSize,
      new Color(
        this.p2.color.r,
        this.p2.color.g,
        this.p2.color.b,
        this.p2.color.a
      )
    );
    this.p3 = new Point(
      centerX + halfSize,
      centerY - halfSize,
      new Color(
        this.p3.color.r,
        this.p3.color.g,
        this.p3.color.b,
        this.p3.color.a
      )
    );
    this.p4 = new Point(
      centerX + halfSize,
      centerY + halfSize,
      new Color(
        this.p4.color.r,
        this.p4.color.g,
        this.p4.color.b,
        this.p4.color.a
      )
    );

    // Memperbarui vertices dan distance
    this.vertices = [this.p1, this.p2, this.p3, this.p4];
    this.distance = newSize;
  }

  getName() {
    return "Square " + this.id;
  }

  getPoints() {
    return [this.p1, this.p2, this.p3, this.p4];
  }

  setPivot(x, y) {
    this.pivotX1 = x - this.p1.x;
    this.pivotY1 = y - this.p1.y;
    this.pivotX2 = x - this.p2.x;
    this.pivotY2 = y - this.p2.y;
    this.pivotX3 = x - this.p3.x;
    this.pivotY3 = y - this.p3.y;
    this.pivotX4 = x - this.p4.x;
    this.pivotY4 = y - this.p4.y;
  }

  isInside(x, y) {
    let crossings = 0;
    const vertices = this.vertices;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i == 2 ? 3 : i == 3 ? 2 : i].x, yi = vertices[i == 2 ? 3 : i == 3 ? 2 : i].y;
        const xj = vertices[j == 2 ? 3 : j == 3 ? 2 : j].x, yj = vertices[j == 2 ? 3 : j == 3 ? 2 : j].y;

        const intersect = ((yi > y) != (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) crossings++;
    }

    return crossings % 2 !== 0;
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
      this.vertices.forEach((vertex) => {
        if (decider % 2 == 0){
          vertex.x =  vertex.initialX + currentMove * (progress <= 1 ? 1 : -1); 
        } else {
          vertex.x =  vertex.initialX - currentMove * (progress <= 1 ? 1 : -1); 
        }
        if (decider <= 2) {
          vertex.y =  vertex.initialY + currentMove * (progress <= 1 ? 1 : -1);
        } else {
          vertex.y =  vertex.initialY - currentMove * (progress <= 1 ? 1 : -1);
        }
      });

      window.requestAnimationFrame(animateStep);
    };

    if (!this.vertices[0].initialX) {
      this.vertices.forEach((vertex) => {
        vertex.initialX = vertex.x;
        vertex.initialY = vertex.y;
      });
    }

    window.requestAnimationFrame(animateStep); // Jadwalkan iterasi selanjutnya
  }
}
