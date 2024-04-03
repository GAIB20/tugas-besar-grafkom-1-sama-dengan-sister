import { useState } from "react";

const SLIDER_STEPS = 0.01;
const SLIDER_MIN = -1;
const SLIDER_MAX = 1;

const Properties = ({
  transformation,
  isOpen,
  shapes,
  selectedShapeId,
  setSelectedShapeId,
  setTransformation,
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
                onChange={(e) => {
                  setSelectedShapeId(e.target.value);
                }}
                value={selectedShapeId}
              >
                {shapes?.map((shape) => {
                  return (
                    <option value={shape.id} key={shape.id}>
                      {shape.getName()}
                    </option>
                  );
                })}
              </select>
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
                  defaultValue={transformation.x}
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
                  defaultValue={transformation.y}
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
                  <p> Rotate X &nbsp; &nbsp; {transformation.rx}</p>{" "}
                </b>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="rotateXSlider"
                  step={SLIDER_STEPS}
                  defaultValue={transformation.rx}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      rx: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="slidecontainer">
                <b>
                  {" "}
                  <p> Rotate Y &nbsp; &nbsp; {transformation.ry}</p>{" "}
                </b>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="rotateYSlider"
                  step={SLIDER_STEPS}
                  defaultValue={transformation.ry}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      ry: e.target.value,
                    }));
                  }}
                />
              </div>
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
                  id="rotateYSlider"
                  step={SLIDER_STEPS}
                  defaultValue={transformation.rz}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      rz: e.target.value,
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
                  id="scaleSlider"
                  step={SLIDER_STEPS}
                  defaultValue={transformation.sx}
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
                  id="scaleSlider"
                  step={SLIDER_STEPS}
                  defaultValue={transformation.sy}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      sy: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="sectionContainer">
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
                  defaultValue={transformation.shx}
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
                  defaultValue={transformation.shy}
                  onChange={(e) => {
                    setTransformation((old) => ({
                      ...old,
                      shy: e.target.value,
                    }));
                  }}
                />
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
