import "./App.css";
import Tool from "./section/Tool";
import Properties from "./section/Properties";
import { useState, useEffect } from "react";
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
import { Line } from "./shapes/line";
import Transformation from "./utils/transformation";
import { Rectangle } from "./shapes/rectangle";

function App() {
  const [workingTitle, setWorkingTitle] = useState("Untitled");
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [originPoint, setOriginPoint] = useState();
  const [colorRgb, setColorRgb] = useState([0, 0, 0, 1]);
  const [gl, setGl] = useState();
  const [positionAttributeLocation, setPositionAttributeLocation] = useState();
  const [colorAttributeLocation, setColorAttribLocation] = useState();
  const [currentShapeType, setCurrentShapeType] = useState();
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState();
  const [transformation, setTransformation] = useState(null);
  const [squareSide, setSquareSide] = useState();

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
    setGl(gl);
    setPositionAttributeLocation(positionAttributeLocation);
    setColorAttribLocation(colorAttributeLocation);
    webglUtils.resizeCanvasToDisplaySize(canvas);
  }, []);

  useEffect(() => {
    if (selectedShapeId !== null) {
      const selectedShape = shapes[selectedShapeId];
      if (selectedShape != null) {
        setIsPropertiesOpen(true);
        var transformationConfig = selectedShape
          .getTransformation()
          .getAllData();
        setTransformation(transformationConfig);
      }
    } else {
      setIsPropertiesOpen(false);
    }
  }, [selectedShapeId]);

  useEffect(() => {
    const selectedShape = shapes[selectedShapeId];

    if (selectedShape) {
      // Update the transformation data to the one that the shape holds
      selectedShape.transformShades(transformation);
      redrawCanvas();
    }
  }, [transformation]); // Watch for changes in shapes state

  useEffect(() => {
    const selectedShape = shapes[selectedShapeId];
    if (selectedShape) {
      selectedShape.updateShapes(squareSide);
      redrawCanvas();
    }
  }, [squareSide]);

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

  const handleMouseDown = (event) => {
    const canvas = document.querySelector("canvas");
    var x = canvasX(canvas, event.clientX);
    var y = canvasY(canvas, event.clientY);

    if (!isDrawing) {
      // Kasus kalau dia baru mulai gambar
      setIsDrawing(true);
      const originPoint = new Point(x, y);
      setOriginPoint(originPoint);
    } else {
      // Kasus kalau dia udah selesai gambar
      const finalPoint = new Point(x, y);
      switch (currentShapeType) {
        case Shape.Square: {
          const square = new Square(
            originPoint,
            finalPoint,
            [...colorRgb, ...colorRgb, ...colorRgb, ...colorRgb],
            shapes.length,
            new Transformation(0, 0, 0, 0, 0, 0, 0, 0)
          );
          setSquareSide(Math.floor(square.distance));
          setShapes((oldShapes) => [...oldShapes, square]);
          setSelectedShapeId(shapes.length);
          break;
        }
        case Shape.Line: {
          const line = new Line(
            originPoint,
            finalPoint,
            [...colorRgb, ...colorRgb, ...colorRgb, ...colorRgb],
            shapes.length
          );
          setShapes((oldShapes) => [...oldShapes, line]);
          setSelectedShapeId(shapes.length);

          break;
        }
        case Shape.Rectangle: {
          const rectangle = new Rectangle(
            originPoint,
            finalPoint,
            [...colorRgb, ...colorRgb, ...colorRgb, ...colorRgb],
            shapes.length,
            new Transformation(0, 0, 0, 0, 0, 0, 0, 0)
          );
          rectangle.render(
            gl,
            positionAttributeLocation,
            colorAttributeLocation
          );
          setShapes((oldShapes) => [...oldShapes, rectangle])
          setSelectedShapeId(shapes.length)
          break;
        }
        default:
          break;
      }
      setOriginPoint(undefined);
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

        case Shape.Line: {
          const line = new Line(originPoint, finalPoint, [
            ...colorRgb,
            ...colorRgb,
            ...colorRgb,
            ...colorRgb,
          ]);
          line.render(gl, positionAttributeLocation, colorAttributeLocation);
          break;
        }
        case Shape.Rectangle: {
          const rectangle = new Rectangle(originPoint, finalPoint, [
            ...colorRgb,
            ...colorRgb,
            ...colorRgb,
            ...colorRgb,
          ]);
          rectangle.render(
            gl,
            positionAttributeLocation,
            colorAttributeLocation
          );
          break;
        }
        default:
          break;
      }
    }
  };

  const lineButtonClicked = () => {
    setCurrentShapeType(Shape.Line);
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
          selectedShapeId={selectedShapeId}
          transformation={transformation}
          setTransformation={setTransformation}
          isOpen={isPropertiesOpen}
          shapes={shapes}
          setSelectedShapeId={setSelectedShapeId}
          squareSide={squareSide}
          setSquareSide={setSquareSide}
        />
      </div>
    </div>
  );
}

export default App;
