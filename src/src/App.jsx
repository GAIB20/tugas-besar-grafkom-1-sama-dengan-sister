import "./App.css";
import Tool from "./section/Tool";
import Properties from "./section/Properties";
import { useEffect, useState } from "react";
import vertexShader from "./init/vertex_shader";
import fragmentShader from "./init/fragment_shader";
import { drawRectangle } from "./draw/drawRectangle";
import createProgram from "./init/create_program";
import createShader from "./init/create_shader";

function App() {
  const [workingTitle, setWorkingTitle] = useState("Untitled");

  const lineButtonClicked = () => {
    console.log("Line Button Clicked");
  };

  const rectangleButtonClicked = () => {
    console.log("Rect Button Clicked");
  };

  const polygonButtonClicked = () => {
    console.log("Poly Button Clicked");
  };

  const squareButtonClicked = () => {
    console.log("Square Button Clicked");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://webglfundamentals.org/webgl/resources/webgl-utils.js";
    script.async = true;
    document.body.appendChild(script);
    main(vertexShader, fragmentShader);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function main() {
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }

    var vertexShaderSource = vertexShader;
    var fragmentShaderSource = fragmentShader;

    var vertexShaderObject = createShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSource
    );

    var fragmentShaderObject = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    var program = createProgram(gl, vertexShaderObject, fragmentShaderObject);
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [
      0.1, 0.2, 0.8, 0.2, 0.1, 0.3, 0.1, 0.3, 0.8, 0.2, 0.8, 0.3,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    var primitiveType = gl.TRIANGLES;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }

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
        <div className="canvasContainer">
          <canvas className="canvas" id="canvas"></canvas>
        </div>
        <Properties />
      </div>
    </div>
  );
}

export default App;
