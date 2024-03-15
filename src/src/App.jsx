import "./App.css";
import Head from "./section/Head";
import Tool from "./section/Tool";
import Properties from "./section/Properties";
import { useState } from "react";

function App() {
  const [workingTitle, setWorkingTitle] = useState("Untitled");

  const lineButtonClicked = () => {
    console.log("Line Button Clicked")
  };

  const rectangleButtonClicked = () => {
    console.log("Rect Button Clicked")
  };

  const polygonButtonClicked = () => {
    console.log("Poly Button Clicked")
  };

  const squareButtonClicked = () => {
    console.log("Square Button Clicked")
  };

  return (
    <div className="screen">
      <Head title={workingTitle} />
      <div className="workspace">
        <Tool
          lineClick={lineButtonClicked}
          rectClick={rectangleButtonClicked}
          polyClick={polygonButtonClicked}
          squareClick={squareButtonClicked}
        />
        <div className="canvasContainer">
          <canvas></canvas>
        </div>
        <Properties />
      </div>
    </div>
  );
}

export default App;
