import "./App.css";
import Head from "./section/Head";
import Tool from "./section/Tool";
import Properties from "./section/Properties";
import { useState } from "react";

function App() {
  const [workingTitle, setWorkingTitle] = useState("Untitled");


  return (
    <div className="screen">
      <Head title={workingTitle}/>
      <div className="workspace">
        <Tool />
        <div className="canvasContainer">
          <canvas></canvas>
        </div>
        <Properties />
      </div>
    </div>
  );
}

export default App;
