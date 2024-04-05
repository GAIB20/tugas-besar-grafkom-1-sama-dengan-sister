import { useState } from "react";
import { Shape } from "../constant/shape";
import { Color } from "../model/color";

const SLIDER_STEPS = 0.01;
const SLIDER_MIN = -1;
const SLIDER_MAX = 1;

const Properties = ({
  selectedShapeId,
  transformation,
  isOpen,
  shapes,
  setSelectedShapeId,
  setTransformation,
  squareSide,
  setSquareSide,
  rectangleSize,
  setRectangleSize,
  selectedPointId,
  setSelectedPointId,
  currentColor,
  setCurrentColor,
  redrawCanvas,
  input, 
  setInput
}) => {
  const [propsOpen, setPropsOpen] = useState(true);

  const changePropsState = () => {
    if (propsOpen) {
      document.getElementById("properties").style.display = "none";
      document.getElementById("propertiesTab").style.display = "flex";
      setPropsOpen(false);
    } else {
      document.getElementById("properties").style.display = "flex";
      document.getElementById("propertiesTab").style.display = "none";
      setPropsOpen(true);
    }
  };

  return (
    <>
      <div className="properties" id="properties">
        <div className="propertiesTitleContainer">
          <p className="propertiesTitle"> Properties </p>

          <button
            onClick={() => {
              changePropsState();
            }}
            className="propertiesButton"
          >
            {" "}
            x{" "}
          </button>
        </div>
        {isOpen && (
          <div className="propertiesContentContainer">
            <div className="sectionContainer">
              <p className="sectionTitle"> Instances </p>
              <select
                className="dropdown"
                value={selectedShapeId}
                onChange={(e) => setSelectedShapeId(Number(e.target.value))}
              >
                {" "}
                {shapes?.map((shape) => {
                  // console.log(shape.id);
                  return (
                    <option value={shape.id} key={shape.id}>
                      {shape.getName()}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div className="sectionContainer">
              <p className="sectionTitle"> Color </p>
              <select
                className="dropdown"
                value={selectedPointId}
                onChange={(e) => setSelectedPointId(Number(e.target.value))}
              >
                {" "}
                {shapes[selectedShapeId].vertices?.map((point) => {
                  var idx = shapes[selectedShapeId].vertices?.indexOf(point);
                  return (
                    <option value={idx} key={idx}>
                      {String(point.x) + ",  " + String(point.y)}
                    </option>
                  );
                })}
              </select>
              <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center"}}>
                  <div style={{ minHeight:"20px", minWidth: "45%", backgroundColor:"rgba("+currentColor.r+", "+currentColor.g+", "+currentColor.b+", 1)", borderRadius: "5px"}}>
                  </div>
                  <input
                    type="text"
                    id="colorInput"
                    className="colorInput"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (/^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(e.target.value)) {
                        shapes[selectedShapeId].vertices[selectedPointId].color.updateHex(e.target.value);
                        redrawCanvas();
                      }
                    }}
                  />
              </div>
              <div className="slidecontainer">
                <b>
                  {" "}
                  <p> Opacity &nbsp; &nbsp; {currentColor.a}</p>{" "}
                </b>
                <input
                  type="range"
                  min={0}
                  max={1}
                  className="slider"
                  id="OpacitySlider"
                  step={0.01}
                  value={currentColor.a}
                  onChange={(e) => {
                    shapes[selectedShapeId].vertices[selectedPointId].color.a = e.target.value;
                    setCurrentColor((old) => ({
                      ...old,
                      a: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="sectionContainer">
              <p className="sectionTitle"> Translation </p>
              <div className="slidecontainer">
                <b>
                  {" "}
                  <p> Translate X &nbsp; &nbsp; {transformation.x}</p>{" "}
                </b>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="translateXSlider"
                  step={SLIDER_STEPS}
                  value={transformation.x}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      x: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="slidecontainer">
                <b>
                  {" "}
                  <p> Translate Y &nbsp; &nbsp; {transformation.y}</p>{" "}
                </b>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="translateYSlider"
                  step={SLIDER_STEPS}
                  value={transformation.y}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      y: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="sectionContainer">
              <p className="sectionTitle"> Rotation </p>
              <div className="slidecontainer">
                <b>
                  {" "}
                  <p> Rotate Z &nbsp; &nbsp; {transformation.rz}</p>{" "}
                </b>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="rotateZSlider"
                  step={SLIDER_STEPS}
                  value={transformation.rz}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      rz: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="slidecontainer">
                <b>
                  {" "}
                  <p> Revolve Z &nbsp; &nbsp; {transformation.rvz}</p>{" "}
                </b>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="revolveZSlider"
                  step={SLIDER_STEPS}
                  value={transformation.rvz}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      rvz: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="sectionContainer">
              <p className="sectionTitle"> Scale </p>
              <div className="slidecontainer">
                <b>
                  {" "}
                  <p> Scale X &nbsp; &nbsp; {transformation.sx}</p>{" "}
                </b>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="scaleXSlider"
                  step={SLIDER_STEPS}
                  value={transformation.sx}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      sx: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="slidecontainer">
                <b>
                  {" "}
                  <p> Scale Y &nbsp; &nbsp; {transformation.sy}</p>{" "}
                </b>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="scaleYSlider"
                  step={SLIDER_STEPS}
                  value={transformation.sy}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      sy: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="sectionContainer" id="shear">
              <p className="sectionTitle"> Shear </p>
              <div className="slidecontainer">
                <b>
                  {" "}
                  <p> Shear X &nbsp; &nbsp; {transformation.shx}</p>{" "}
                </b>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="shearXSlider"
                  step={SLIDER_STEPS}
                  value={transformation.shx}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      shx: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="slidecontainer">
                <b>
                  {" "}
                  <p> Shear Y &nbsp; &nbsp; {transformation.shy}</p>{" "}
                </b>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="shearYSlider"
                  step={SLIDER_STEPS}
                  value={transformation.shy}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      shy: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="slidecontainer">
                {shapes[selectedShapeId].getType() === Shape.Square && (
                  <>
                    <b>
                      {" "}
                      <p>
                        {" "}
                        {shapes[selectedShapeId].getName() +
                          " Size : " +
                          squareSide}
                      </p>{" "}
                    </b>
                    <input
                      type="range"
                      min={0}
                      max={500}
                      className="slider"
                      value={squareSide}
                      onChange={(e) => {
                        setSquareSide(Number(e.target.value));
                      }}
                    />
                  </>
                )}
                {shapes[selectedShapeId].getType() === Shape.Rectangle && (
                  <>
                    <b>
                      {" "}
                      <p>
                        {" "}
                        {shapes[selectedShapeId].getName() +
                          " Width : " +
                          rectangleSize.width}
                      </p>{" "}
                      <input
                        type="range"
                        min={0}
                        max={500}
                        className="slider"
                        id="shearYSlider"
                        step={SLIDER_STEPS}
                        value={rectangleSize.width}
                        onChange={(e) => {
                          setRectangleSize((oldSize) => ({
                            ...oldSize,
                            width: Number(e.target.value),
                          }));
                        }}
                      />
                      <p>
                        {" "}
                        {shapes[selectedShapeId].getName() +
                          " Length : " +
                          rectangleSize.length}
                      </p>{" "}
                      <input
                        type="range"
                        min={0}
                        max={500}
                        className="slider"
                        id="shearYSlider"
                        step={SLIDER_STEPS}
                        value={rectangleSize.length}
                        onChange={(e) => {
                          setRectangleSize((oldSize) => ({
                            ...oldSize,
                            length: Number(e.target.value),
                          }));
                        }}
                      />
                    </b>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        onClick={() => changePropsState()}
        className="propertiesTab"
        id="propertiesTab"
      >
        <p className="propertiesTabTitle"> Properties </p>
      </div>
    </>
  );
};

export default Properties;
