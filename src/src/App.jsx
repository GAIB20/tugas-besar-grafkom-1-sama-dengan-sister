import "./App.css";
import Tool from "./section/Tool";
import Properties from "./section/Properties";
import { useState } from "react";
import { drawTriangle } from "./draw/drawTriangle";
import { drawRectangle } from "./draw/drawRectangle";
import Transformation from "./utils/transformation";
import drawLine from "./draw/drawLine";
import drawSquare from "./draw/drawSquare";

function App() {
  const [workingTitle, setWorkingTitle] = useState("Untitled");
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true)
  const transformation = new Transformation(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

  const lineButtonClicked = () => {
    drawLine();
  };

  const rectangleButtonClicked = () => {
    // console.log("Rect Button Clicked");
    drawRectangle();
  };

  const polygonButtonClicked = () => {
    drawTriangle()
    // console.log("Poly Button Clicked");
  };

  const squareButtonClicked = () => {
    // console.log("Square Button Clicked");
    drawSquare()
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
        <Properties transformation={transformation} isOpen={isPropertiesOpen}/>
      </div>
    </div>
  );
}

export default App;
