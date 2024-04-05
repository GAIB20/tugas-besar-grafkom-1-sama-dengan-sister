import "./App.css";
import Tool from "./section/Tool";
import Properties from "./section/Properties";
import { useState, useEffect } from "react";
import { Point } from "./model/point";
import { createShader, createProgram } from "./shader";
import {
  canvasX,
  canvasY,
  convertPointToPairs,
  isPointInConvexHull,
  makeConvexHull,
} from "./utils/misc";
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
  const [workingTitle, setWorkingTitle] = useState("Potosop");
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
  const [selectedShapeId, setSelectedShapeId] = useState(null);
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
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingVertex, setIsDraggingVertex] = useState(false);
  console.log(polygonPoints);

  const handleSaveModels = () => {
    downloadModel(shapes, workingTitle);
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

  // LISTENER TO CURRENT SELECTED SHAPE ID
  useEffect(() => {
    if (selectedShapeId !== null) {
      const selectedShape = shapes[selectedShapeId];
      if (selectedShape != null) {
        console.log("Ini selectedSHape : ", selectedShape);
        setIsPropertiesOpen(true);

        // Change the transformation to each shape's transform data
        var transformationConfig = selectedShape
          .getTransformation()
          .getAllData();
        setTransformation(transformationConfig);
        setSelectedPointId(0);
        // setCurrentColor(shapes[selectedShapeId].vertices[0].color); // BENTAR

        // Adjust
        // setCurrentShapeType(selectedShape.getShapeType());

        // If a polygon is selected, change polygonPoints and set to Creation Mode
        if (selectedShape.getShapeType() == Shape.Polygon) {
          var tempPoints = selectedShape.getPoints();
          setPolygonPoints(tempPoints);
          setCurrentShapeType(Shape.Polygon);
        }
        redrawCanvas();
      }
    } else {
      setIsPropertiesOpen(false);
      redrawCanvas();
    }
  }, [selectedShapeId]);

  // LISTENER TO CURRENT SELECTED POINT
  // BENTAR
  // useEffect(() => {
  //   if (selectedPointId !== null) {
  //     setCurrentColor(shapes[selectedShapeId].vertices[selectedPointId].color);
  //   }
  // }, [selectedPointId]);

  // LISTENER TO CURRENT SELECTED SHAPE
  useEffect(() => {
    if (shapes.length == 0) {
      setSelectedShapeId(null);
      redrawCanvas();
    } else {
      setSelectedShapeId(shapes.length - 1);
    }
  }, [shapes]);

  // LISTENER TO CURRENT SELECTED COLOR
  useEffect(() => {
    redrawCanvas();
  }, [currentColor]);

  // LISTENER TO TRANSFORMATION CHANGES
  useEffect(() => {
    const selectedShape = shapes[selectedShapeId];

    if (selectedShape) {
      // Update the transformation data to the one that the shape holds
      selectedShape.transformShades(transformation);
      redrawCanvas();
    }
  }, [transformation]);

  // LISTENER TO SQUARE ATTRIBUTES
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

  // LISTENER TO RECTANGLE ATTRIBUTES
  useEffect(() => {
    const selectedShape = shapes[selectedShapeId];
    if (selectedShape) {
      selectedShape.updateShapes(rectangleSize);
      redrawCanvas();
    }
  }, [rectangleSize]);

  // LISTENER TO FILE OBJECT
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const textContent = reader.result;
        const parsedShapes = parseFile(textContent, shapes.length);
        for(let i = 0; i < parsedShapes.length; i++){
          const currentShape = parsedShapes[i]
          if(currentShape.getType() === Shape.Polygon){
            setPolygonPoints(currentShape.getPoints())
          }
        }
        setShapes((oldShapes) => [...oldShapes, ...parsedShapes]);
        setSelectedShapeId(parsedShapes[0].id);
        redrawCanvas();
      };
    }
  }, [file]);

  // REDRAW CANVAS FUNCTION
  const redrawCanvas = () => {
    if (shapes.length == 0) {
      if (!gl) {
        return;
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
    } else {
      console.log("Ini shapes di redraw : ", shapes)
      for (let i = 0; i < shapes.length; i++) {
        const currentShape = shapes[i];
        // console.log(currentShape);
        const currentObj = i == selectedShapeId;
        currentShape.render(
          gl,
          positionAttributeLocation,
          colorAttributeLocation,
          currentObj
        );
      }
    }
    // window.requestAnimationFrame(redrawCanvas);
  };

  // GET THE CENTER POINT OF CANVAS
  const getCanvasCenter = (canvas) => {
    // Get Canvas Center
    var rect = canvas.getBoundingClientRect();
    const canvasCenter = [
      (rect.right - rect.left) / 2,
      (rect.bottom - rect.top) / 2,
    ];
    return canvasCenter;
  };

  // LISTENER TO MOUSE CLICK
  const handleMouseDown = (event) => {
    setIsDragging(true);
    const canvas = document.querySelector("canvas");
    var x = canvasX(canvas, event.clientX);
    var y = canvasY(canvas, event.clientY);
    var canvasCenter = getCanvasCenter(canvas);

    // Special Case for Polygons
    if (currentShapeType == Shape.Polygon) {
      var point = new Point(
        x,
        y,
        new Color(
          currentColor.r,
          currentColor.g,
          currentColor.b,
          currentColor.a
        )
      );

      // Check if it is to erase
      var idx = null;
      for (var i = 0; i < polygonPoints.length; i++) {
        var distance = Math.sqrt(
          Math.pow(polygonPoints[i].x - x, 2) +
            Math.pow(polygonPoints[i].y - y, 2)
        );
        if (distance < 10) {
          idx = i;
          break;
        }
      }

      // If found, then erase
      if (idx) {
        polygonPoints.splice(idx, 1);
        polygonColorPoints.splice(idx, 4);
      } else {
        polygonPoints.push(point);
        polygonColorPoints.push(...colorRgb);
      }

      // Make convexHull of the points
      const pointPairs = convertPointToPairs(polygonPoints);
      var convexHull = makeConvexHull(pointPairs);
      console.log(point, convexHull)

      var points = [];
      for(i = 0; i < polygonPoints.length; i++){
        var tempPoint = polygonPoints[i]
        if (isPointInConvexHull(tempPoint, convexHull)){
          points.push(tempPoint)
        }
      }
      setPolygonPoints(points);

      // Set points to Polygon
      const selectedPolygon = shapes[selectedShapeId];
      selectedPolygon.setPoints(points);
      selectedPolygon.setColorPoints(polygonColorPoints);

      // Redraw Canvas
      redrawCanvas();
    } else {
      if (!isDrawing) {
        // START DRAWING CASE
        console.log(currentShapeType);
        if (currentShapeType != null) {
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
          var isObject = false;
          for (let i = shapes.length - 1; i >= 0; i--) {
            if (shapes[i].isInside(x, y)) {
              setSelectedShapeId(i);
              shapes[i].setPivot(x, y);
              var isCorner = shapes[i].isCorner(x, y);
              if (isCorner != null) {
                setIsDraggingVertex(true);
                setSelectedPointId(isCorner);
              }
              isObject = true;
              break;
            }
          }
          if (!isObject) {
            setSelectedShapeId(null);
          }
        }
      } else {
        // FINISH DRAWING CASE
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
              id: shapes.length,
              transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0),
              canvasCenter: canvasCenter,
            });
            setShapes((oldShapes) => [...oldShapes, rectangle]);
            break;
          }
          default:
            break;
        }
        setOriginPoint(undefined);
        setIsDrawing(false);
        setCurrentShapeType(null);
      }
    }
  };

  // LISTENER TO MOUSE MOVE
  const handleMouseMove = (event) => {
    if (!isDragging) {
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
              fromFile: false,
            });
            square.render(
              gl,
              positionAttributeLocation,
              colorAttributeLocation,
              false
            );
            break;
          }

          case Shape.Line: {
            const line = new Line({
              origin: originPoint,
              final: finalPoint,
            });
            line.render(
              gl,
              positionAttributeLocation,
              colorAttributeLocation,
              false
            );
            break;
          }
          case Shape.Rectangle: {
            const rectangle = new Rectangle({
              origin: originPoint,
              final: finalPoint,
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
    } else {
      const canvas = document.querySelector("canvas");
      var x = canvasX(canvas, event.clientX);
      var y = canvasY(canvas, event.clientY);

      if (selectedShapeId != null) {
        console.log(isDraggingVertex);
        if (!isDraggingVertex) {
          shapes[selectedShapeId].place(x, y);
        } else {
          shapes[selectedShapeId].changeVertex(x, y, selectedPointId);
        }
        redrawCanvas();
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingVertex(false);
  };

  const refreshChosenButton = () => {
    document.getElementById("lineButtonTitle").style.backgroundColor = "white";
    document.getElementById("rectangleButtonTitle").style.backgroundColor =
      "white";
    document.getElementById("squareButtonTitle").style.backgroundColor =
      "white";
    document.getElementById("polygonButtonTitle").style.backgroundColor =
      "white";
  };

  // FUNCTION LINE BUTTON HANDLE
  const lineButtonClicked = (e) => {
    setPolygonPoints([]);
    refreshChosenButton();
    if (currentShapeType == Shape.Line) {
      setCurrentShapeType(null);
    } else {
      setCurrentShapeType(Shape.Line);
      document.getElementById("lineButtonTitle").style.backgroundColor =
        "green";
    }
  };

  // FUNCTION RECTANGLE BUTTON HANDLE
  const rectangleButtonClicked = () => {
    setPolygonPoints([]);
    refreshChosenButton();
    if (currentShapeType == Shape.Rectangle) {
      setCurrentShapeType(null);
    } else {
      setCurrentShapeType(Shape.Rectangle);
      document.getElementById("rectangleButtonTitle").style.backgroundColor =
        "green";
    }
  };

  // FUNCTION POLYGON BUTTON HANDLE
  const polygonButtonClicked = () => {
    // Reset Polygon Points
    setPolygonPoints([]);
    setPolygonColorPoints([]);

    if (currentShapeType != Shape.Polygon) {
      // For Polygon, on Button Clicked, a new Polygon is Constructed
      const canvas = document.querySelector("canvas");
      var canvasCenter = getCanvasCenter(canvas);
      const polygon = new Polygon(
        [],
        shapes.length,
        new Transformation(0, 0, 0, 0, 0, 0, 0, 0),
        canvasCenter
      );
      setShapes((oldShapes) => [...oldShapes, polygon]);
      setSelectedShapeId(shapes.length);
      setCurrentShapeType(Shape.Polygon);
    } else {
      // Condition currentShapeType == null
      setCurrentShapeType(null);
    }
  };

  // FUNCTION SQUARE BUTTON HANDLE
  const squareButtonClicked = () => {
    setPolygonPoints([]);
    refreshChosenButton();
    if (currentShapeType == Shape.Square) {
      setCurrentShapeType(null);
    } else {
      setCurrentShapeType(Shape.Square);
      document.getElementById("squareButtonTitle").style.backgroundColor =
        "green";
    }
  };

  const handleAnimation = () => {
    console.log("Halo");
    // for (let i = 0; i < shapes.length; i++) {
    //   const shape = shapes[i];
    //   shape.animateRightAndBack(
    //     gl,
    //     positionAttributeLocation,
    //     colorAttributeLocation
    //   );
    // }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Backspace" && selectedShapeId != null) {
      shapes.splice(selectedShapeId, 1);
      if (shapes.length == 0) {
        setSelectedShapeId(null);
      } else {
        if (selectedShapeId == shapes.length) {
          setSelectedShapeId(selectedShapeId - 1);
        }
      }
      console.log(selectedShapeId, shapes.length);
      redrawCanvas();
    }
  };

  return (
    <div className="screen" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="topbar">
        <input
          className="topbar-logo"
          onChange={(e) => setWorkingTitle(e.target.value)}
          value={workingTitle}
        />

        {currentShapeType ? (
          <div className="modeTitle">CREATION MODE</div>
        ) : (
          <div className="modeTitle">SELECT MODE</div>
        )}
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
          onMouseUp={handleMouseUp}
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
