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
import { Color } from "./model/color";
import { Polygon } from "./shapes/polygon";
import { downloadModel } from "./file/save";
import { parseFile } from "./file/load";

function App() {
  const [workingTitle, setWorkingTitle] = useState("Untitled");
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [originPoint, setOriginPoint] = useState();
  const [colorRgb, setColorRgb] = useState([0, 0, 0, 1]);
  const [currentColor, setCurrentColor] = useState(new Color(0, 0, 0, 1));
  const [gl, setGl] = useState();
  const [positionAttributeLocation, setPositionAttributeLocation] = useState();
  const [colorAttributeLocation, setColorAttribLocation] = useState();
  const [currentShapeType, setCurrentShapeType] = useState();
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState();
  const [selectedPointId, setSelectedPointId] = useState(null);
  const [transformation, setTransformation] = useState(null);
  const [squareSide, setSquareSide] = useState();
  const [rectangleSize, setRectangleSize] = useState({
    width: 0,
    length: 0,
  });
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [polygonColorPoints, setPolygonColorPoints] = useState([]);
  const [file, setFile] = useState();

  const handleSaveModels = () => {
    downloadModel(shapes);
  };

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

        // Change the transformation to each shape's transform data
        var transformationConfig = selectedShape
          .getTransformation()
          .getAllData();
        setTransformation(transformationConfig);
        setSelectedPointId(0);
        setCurrentColor(shapes[selectedShapeId].vertices[0].color);

        // Adjust
        setCurrentShapeType(selectedShape.getShapeType());

        // If a polygon is selected, change polygonPoints too
        if (selectedShape.getShapeType() == Shape.Polygon) {
          var tempPoints = selectedShape.getPoints();
          setPolygonPoints(tempPoints);
        }
      }
    } else {
      setIsPropertiesOpen(false);
    }
  }, [selectedShapeId]);

  useEffect(() => {
    if (selectedPointId !== null) {
      setCurrentColor(shapes[selectedShapeId].vertices[selectedPointId].color);
    }
  }, [selectedPointId]);

  useEffect(() => {
    setSelectedShapeId(shapes.length - 1);
  }, [shapes]);

  useEffect(() => {
    console.log("MASUKKK");
    console.log();
    redrawCanvas();
  }, [currentColor]);

  useEffect(() => {
    const selectedShape = shapes[selectedShapeId];

    if (selectedShape) {
      console.log("Masuk ke transformation");
      // Update the transformation data to the one that the shape holds
      selectedShape.transformShades(transformation);
      redrawCanvas();
    }
  }, [transformation]);

  useEffect(() => {
    const selectedShape = shapes[selectedShapeId];
    if (selectedShape) {
      selectedShape.updateShapes(squareSide);
      redrawCanvas();
      setTransformation((oldTransformation) => ({
        ...oldTransformation,
        rz: 0,
        rvz: 0,
        sx: 0,
        sy: 0,
        shx: 0,
        shy: 0,
      }));
    }
  }, [squareSide]);

  useEffect(() => {
    const selectedShape = shapes[selectedShapeId];
    if (selectedShape) {
      selectedShape.updateShapes(rectangleSize);
      redrawCanvas();
    }
  }, [rectangleSize]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const textContent = reader.result;
        const parsedShapes = parseFile(textContent, shapes.length);
        setShapes((oldShapes) => [...oldShapes, ...parsedShapes]);
        setSelectedShapeId(parsedShapes[0].id);
        redrawCanvas();
      };
    }
  }, [file]);

  const redrawCanvas = () => {
    for (let i = 0; i < shapes.length; i++) {
      const currentShape = shapes[i];
      // console.log(currentShape);
      currentShape.render(
        gl,
        positionAttributeLocation,
        colorAttributeLocation
      );
    }
    // window.requestAnimationFrame(redrawCanvas);
  };

  const getCanvasCenter = (canvas) => {
    // Get Canvas Center
    var rect = canvas.getBoundingClientRect();
    const canvasCenter = [
      (rect.right - rect.left) / 2,
      (rect.bottom - rect.top) / 2,
    ];
    return canvasCenter;
  };

  const handleMouseDown = (event) => {
    const canvas = document.querySelector("canvas");
    var x = canvasX(canvas, event.clientX);
    var y = canvasY(canvas, event.clientY);
    // console.log(x, y);

    var canvasCenter = getCanvasCenter(canvas);

    // Special Case for Polygons
    if (currentShapeType == Shape.Polygon) {
      var point = new Point(x, y);

      // // Check if it is to erase
      // var idx = undefined
      // for (var i = 0; i < polygonPoints.length; i++){
      //   var distance =  Math.sqrt(Math.pow((polygonPoints[i].x - x),2) + Math.pow((polygonPoints[i].y - y),2))
      //   if (distance < 10){
      //     idx = i;
      //     break
      //   }
      // }

      // // If found, then erase
      // if (idx){
      //   polygonPoints.splice(idx, 1);
      //   polygonColorPoints.splice(idx,1);
      // } else {
      //   polygonPoints.push(point);
      //   polygonColorPoints.push(...colorRgb);
      //   // console.log(polygonPoints)
      // }

      polygonPoints.push(point);
      polygonColorPoints.push(...colorRgb);

      const selectedPolygon = shapes[selectedShapeId];
      selectedPolygon.setPoints(polygonPoints);
      selectedPolygon.setColorPoints(polygonColorPoints);

      // Redraw Canvas
      redrawCanvas();
      setPolygonPoints(selectedPolygon.getPoints());
      console.log(polygonPoints);
    } else {
      if (!isDrawing) {
        // Kasus kalau dia baru mulai gambar
        setIsDrawing(true);
        const originPoint = new Point(
          x,
          y,
          new Color(
            currentColor.r,
            currentColor.g,
            currentColor.b,
            currentColor.a
          )
        );
        setOriginPoint(originPoint);
      } else {
        // Kasus kalau dia udah selesai gambar
        const finalPoint = new Point(
          x,
          y,
          new Color(
            currentColor.r,
            currentColor.g,
            currentColor.b,
            currentColor.a
          )
        );
        switch (currentShapeType) {
          case Shape.Square: {
            const square = new Square({
              origin: originPoint,
              final: finalPoint,
              color: [...colorRgb, ...colorRgb, ...colorRgb, ...colorRgb],
              id: shapes.length,
              transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0),
              canvasCenter: canvasCenter,
              fromFile: false,
            });
            // setSquareSide(Math.floor(square.distance));
            setShapes((oldShapes) => [...oldShapes, square]);
            break;
          }
          case Shape.Line: {
            const line = new Line({
              origin: originPoint,
              final: finalPoint,
              color: [...colorRgb, ...colorRgb, ...colorRgb, ...colorRgb],
              id: shapes.length,
              transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0),
              canvasCenter: canvasCenter,
              fromFile: false,
            });
            setShapes((oldShapes) => [...oldShapes, line]);
            setSelectedShapeId(shapes.length);
            break;
          }
          case Shape.Rectangle: {
            const rectangle = new Rectangle({
              origin: originPoint,
              final: finalPoint,
              color: [...colorRgb, ...colorRgb, ...colorRgb, ...colorRgb],
              id: shapes.length,
              transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0),
              canvasCenter: canvasCenter,
            });

            setShapes((oldShapes) => [...oldShapes, rectangle]);
            setSelectedShapeId(shapes.length);
            redrawCanvas();
            break;
          }
          default:
            break;
        }
        setOriginPoint(undefined);
        setIsDrawing(false);
      }
    }
  };

  const handleMouseMove = (event) => {
    const canvas = document.querySelector("canvas");
    redrawCanvas();
    if (isDrawing) {
      let x2 = canvasX(canvas, event.clientX);
      let y2 = canvasY(canvas, event.clientY);
      const finalPoint = new Point(x2, y2, currentColor);

      switch (currentShapeType) {
        case Shape.Square: {
          const square = new Square({
            origin: originPoint,
            final: finalPoint,
            color: [...colorRgb, ...colorRgb, ...colorRgb, ...colorRgb],
            fromFile: false,
          });
          square.render(gl, positionAttributeLocation, colorAttributeLocation);
          break;
        }

        case Shape.Line: {
          const line = new Line({
            origin: originPoint,
            final: finalPoint,
          });
          line.render(gl, positionAttributeLocation, colorAttributeLocation);
          break;
        }
        case Shape.Rectangle: {
          const rectangle = new Rectangle({
            origin: originPoint,
            final: finalPoint,
            color: [...colorRgb, ...colorRgb, ...colorRgb, ...colorRgb],
          });
          rectangle.render(
            gl,
            positionAttributeLocation,
            colorAttributeLocation
          );
          break;
        }
      }
    }
  };

  const lineButtonClicked = () => {
    setCurrentShapeType(Shape.Line);
  };

  const rectangleButtonClicked = () => {
    setCurrentShapeType(Shape.Rectangle);
  };

  const polygonButtonClicked = () => {
    setCurrentShapeType(Shape.Polygon);

    // Reset Polygon Points
    setPolygonPoints([]);
    setPolygonColorPoints([]);

    // For Polygon, on Button Clicked, a new Polygon is Constructed
    const canvas = document.querySelector("canvas");
    var canvasCenter = getCanvasCenter(canvas);
    const polygon = new Polygon(
      polygonPoints,
      polygonColorPoints,
      shapes.length,
      new Transformation(0, 0, 0, 0, 0, 0, 0, 0),
      canvasCenter
    );
    setShapes((oldShapes) => [...oldShapes, polygon]);
    setSelectedShapeId(shapes.length);
  };

  const squareButtonClicked = () => {
    setCurrentShapeType(Shape.Square);
  };

  const handleAnimation = () => {
    console.log("Halo");
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      shape.animateRightAndBack(
        gl,
        positionAttributeLocation,
        colorAttributeLocation
      );
    }
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
          handleSaveModels={handleSaveModels}
          setFile={setFile}
          handleAnimation={handleAnimation}
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
          rectangleSize={rectangleSize}
          setRectangleSize={setRectangleSize}
          selectedPointId={selectedPointId}
          setSelectedPointId={setSelectedPointId}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          redrawCanvas={redrawCanvas}
        />
      </div>
    </div>
  );
}

export default App;
