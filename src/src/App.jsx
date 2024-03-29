import "./App.css";
import Tool from "./section/Tool";
import Properties from "./section/Properties";
import { useState } from "react";
import { drawTriangle } from "./draw/triangle";
import { drawRectangle } from "./draw/drawRectangle";

function App() {
  const [workingTitle, setWorkingTitle] = useState("Untitled");

  const lineButtonClicked = () => {
    drawTriangle();
  };

  const rectangleButtonClicked = () => {
    console.log("Rect Button Clicked");
  };

  const polygonButtonClicked = () => {
    console.log("Poly Button Clicked");
  };

  const squareButtonClicked = () => {
    console.log("Square Button Clicked");
    drawRectangle();
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
        <div className="canvasContainer">
          <canvas className="canvas" id="canvas"></canvas>
        </div>
        <Properties />
      </div>
    </div>
  );
}

export default App;
