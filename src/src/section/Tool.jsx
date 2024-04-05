function Tool({
  lineClick,
  rectClick,
  polyClick,
  squareClick,
  handleSaveModels,
  setFile,
  handleAnimation
}) {
  const setLineButtonTitle = (enter) => {
    let elm = document.getElementById("lineButtonTitle");
    if (enter) {
      elm.style.opacity = 0.85;
    } else {
      elm.style.opacity = 0;
    }
  };

  const setRectangleButtonTitle = (enter) => {
    let elm = document.getElementById("rectangleButtonTitle");
    if (enter) {
      elm.style.opacity = 0.85;
    } else {
      elm.style.height = 0;
      elm.style.opacity = 0;
    }
  };

  const setSquareButtonTitle = (enter) => {
    let elm = document.getElementById("squareButtonTitle");
    if (enter) {
      elm.style.opacity = 0.85;
    } else {
      elm.style.height = 0;
      elm.style.opacity = 0;
    }
  };

  const setPolygonButtonTitle = (enter) => {
    let elm = document.getElementById("polygonButtonTitle");
    if (enter) {
      elm.style.opacity = 0.85;
    } else {
      elm.style.opacity = 0;
    }
  };

  return (
    <div className="toolbar-container">
      <div className="toolbar">
        <button
          onClick={() => {
            lineClick();
          }}
          onMouseEnter={() => {
            setLineButtonTitle(true);
          }}
          onMouseLeave={() => {
            setLineButtonTitle(false);
          }}
          className="toolbarButton"
        >
          <img className="toolbarButtonImage" src="line.png" />
          <div className="lineButtonTitle" id="lineButtonTitle">
            Line{" "}
          </div>
        </button>

        <button
          onClick={() => {
            rectClick();
          }}
          onMouseEnter={() => {
            setRectangleButtonTitle(true);
          }}
          onMouseLeave={() => {
            setRectangleButtonTitle(false);
          }}
          className="toolbarButton"
        >
          <img className="toolbarButtonImage" src="rectangle.png" />
          <div className="rectangleButtonTitle" id="rectangleButtonTitle">
            {" "}
            Rectangle{" "}
          </div>
        </button>

        <button
          onClick={() => {
            squareClick();
          }}
          onMouseEnter={() => {
            setSquareButtonTitle(true);
          }}
          onMouseLeave={() => {
            setSquareButtonTitle(false);
          }}
          className="toolbarButton"
        >
          <img className="toolbarButtonImage" src="square.png" />
          <div className="squareButtonTitle" id="squareButtonTitle">
            {" "}
            Square{" "}
          </div>
        </button>

        <button
          onClick={() => {
            polyClick();
          }}
          onMouseEnter={() => {
            setPolygonButtonTitle(true);
          }}
          onMouseLeave={() => {
            setPolygonButtonTitle(false);
          }}
          className="toolbarButton"
        >
          <img className="toolbarButtonImage" src="polygon.png" />
          <div className="polygonButtonTitle" id="polygonButtonTitle">
            {" "}
            Polygon{" "}
          </div>
        </button>

        <div className="button-container">
          <button className="saveButton" onClick={handleSaveModels}>Save</button>
          <label htmlFor="fileInput" className="inputButton" > Input </label>
          <input
            type="file"
            id="fileInput"
            className="inputButton"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
          />
          <button className="animateButton" onClick={()=>handleAnimation()}>
            Animate
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tool;
