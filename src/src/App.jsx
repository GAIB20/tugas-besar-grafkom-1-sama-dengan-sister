import "./App.css";
import Tool from "./section/Tool";
import Properties from "./section/Properties";
import { useState, useEffect } from "react";
import { drawTriangle } from "./draw/drawTriangle";
import { drawRectangle } from "./draw/drawRectangle";
import Transformation from "./utils/transformation";
import drawLine from "./draw/drawLine";
import drawSquare from "./draw/drawSquare";
import { Point } from "./model/point";
import { createShader, createProgram } from "./shader";
import { canvasX, canvasY } from "./utils/misc";
import * as webglUtils from "webgl-utils.js";
import { Shape } from "./constant/shape";
import {
  fragmentShaderSource,
  vertexShaderSource,
} from "./constant/shader-source";
import { Square } from "./shapes/square";

function App() {
  const [workingTitle, setWorkingTitle] = useState("Untitled");
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [originPoint, setOriginPoint] = useState();
  const [colorRgb, setColorRgb] = useState([0, 0, 0, 1]);
  const [gl, setGl] = useState();
  const [positionAttributeLocation, setPositionAttributeLocation] = useState();
  const [colorAttributeLocation, setColorAttribLocation] = useState();
  const [points, setPoints] = useState([]);
  const [currentShapeType, setCurrentShapeType] = useState();
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState();
  // const [transformation, setTransformation] = useState();

  useEffect(() => {
    // Inisialisasi Web Gl
    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("GL doesnt exist");
      return;
    }
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    var program = createProgram(gl, vertexShader, fragmentShader);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );
    var colorUniformLocation = gl.getUniformLocation(program, "u_color");
    var colorAttributeLocation = gl.getAttribLocation(program, "a_color");

    // Create a buffer to put three 2d clip space points in and bind it to ARRAY_BUFFER
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell WebGL how to convert from clip space to pixels
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    setTransformation(new Transformation(0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
    setGl(gl);
    setPositionAttributeLocation(positionAttributeLocation);
    setColorAttribLocation(colorAttributeLocation);
    webglUtils.resizeCanvasToDisplaySize(canvas);
  }, []);

  useEffect(() => {
    console.log("Berubah");
  }, [transformation]);

  const redrawCanvas = () => {
    for (let i = 0; i < shapes.length; i++) {
      const currentShape = shapes[i];
      currentShape.render(
        gl,
        positionAttributeLocation,
        colorAttributeLocation
      );
    }
  };

  const renderCornerPoint = () => {
    const totalPoints = points.length;
    for (var i = 0; i < totalPoints - 1; i++) {
      let x1 = points[i].x;
      let y1 = points[i].y;
      let x2 = points[i + 1].x;
      let y2 = points[i + 1].y;
      let vertices = [x1, y1, x2, y1, x1, y2, x2, y2];
      console.log(vertices);

      render(gl.TRIANGLE_STRIP, vertices, [0, 0, 0, 1]);
    }
  };

  const handleMouseDown = (event) => {
    const canvas = document.querySelector("canvas");
    var x = canvasX(canvas, event.clientX);
    var y = canvasY(canvas, event.clientY);

    if (!isDrawing) {
      // Kasus kalau dia baru mulai gambar
      setIsDrawing(true);
      const originPoint = new Point(x, y);
      setOriginPoint(originPoint);
      setPoints([originPoint]); // Pastikan ini adalah array
    } else {
      // Kasus kalau dia udah selesai gambar
      const finalPoint = new Point(x, y);
      switch (currentShapeType) {
        case Shape.Square: {
          const square = new Square(
            originPoint,
            finalPoint,
            [...colorRgb, ...colorRgb, ...colorRgb, ...colorRgb],
            shapes.length + 1
          );
          // square.render(gl, positionAttributeLocation, colorAttributeLocation);
          setShapes((oldShapes) => [...oldShapes, square]);
          setPoints((oldPoints) => [...oldPoints, finalPoint]);
          break;
        }

        default:
          break;
      }
      setOriginPoint(undefined);
      setCurrentShapeType(undefined);
      // redrawCanvas();
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (event) => {
    const canvas = document.querySelector("canvas");
    redrawCanvas();
    if (isDrawing) {
      let x2 = canvasX(canvas, event.clientX);
      let y2 = canvasY(canvas, event.clientY);
      const finalPoint = new Point(x2, y2);

      switch (currentShapeType) {
        case Shape.Square: {
          const square = new Square(originPoint, finalPoint, [
            ...colorRgb,
            ...colorRgb,
            ...colorRgb,
            ...colorRgb,
          ]);
          square.render(gl, positionAttributeLocation, colorAttributeLocation);
          break;
        }
        // Dia ga punya id karena ini cuma temporary square (belom fix)

        default:
          break;
      }
    }
  };

  const render = (type, vertices, color) => {
    console.log("Ini vertices di render : ", vertices);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttributeLocation);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.drawArrays(type, 0, vertices.length / 2);
  };

  const transformation = new Transformation(
    0.5,
    0.4,
    0.3,
    0.2,
    1,
    0.8,
    0.6,
    0.3
  );
  transformation.print();

  const lineButtonClicked = () => {
    setCurrentType(Shape.Line);
  };

  const rectangleButtonClicked = () => {
    // console.log("Rect Button Clicked");
    setCurrentShapeType(Shape.Rectangle);
  };

  const polygonButtonClicked = () => {
    setCurrentShapeType(Shape.Polygon);
    // console.log("Poly Button Clicked");
  };

  const squareButtonClicked = () => {
    // console.log("Square Button Clicked");
    // setIsDrawing(true)
    setCurrentShapeType(Shape.Square);
  };

  return (
    <div className="screen">
      <div className="topbar">
        <input
          className="topbar-logo"
          onChange={(e) => setWorkingTitle(e.target.value)}
          value={workingTitle}
        />
      </div>
      <div className="workspace">
        <Tool
          lineClick={lineButtonClicked}
          rectClick={rectangleButtonClicked}
          polyClick={polygonButtonClicked}
          squareClick={squareButtonClicked}
        />
        <div
          className="canvasContainer"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          <canvas className="canvas" id="canvas"></canvas>
        </div>
        <Properties
          transformation={transformation}
          isOpen={isPropertiesOpen}
          shapes={shapes}
          setSelectedShapeId={setSelectedShapeId}
        />
      </div>
    </div>
  );
}

export default App;
