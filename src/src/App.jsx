import "./App.css";
import Tool from "./section/Tool";
import Properties from "./section/Properties";
import { useEffect, useState } from "react";
import { drawRectangle } from "./draw/drawRectangle";

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
    drawRectangle();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://webglfundamentals.org/webgl/resources/webgl-utils.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
