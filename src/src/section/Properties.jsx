import { useState, useEffect } from "react";

const SLIDER_STEPS = 1;
const SLIDER_MIN = -90;
const SLIDER_MAX = 90;

const Properties = ({ tick, selectedShapeId, transformation, isOpen, shapes, setSelectedShapeId, setTransformation }) => {
  const [propsOpen, setPropsOpen] = useState(true);

  var translation = transformation.getTranslation()
  var rotation = transformation.getRotation()
  var scale = transformation.getScale()
  var shear = transformation.getShear()

  // TO DO: Change to Default Value
  const [translateXVal, setTranslateXVal] = useState(translation[0]);
  const [translateYVal, setTranslateYVal] = useState(translation[1]);
  const [rotateXVal, setRotateXVal] = useState(rotation[0]);
  const [rotateYVal, setRotateYVal] = useState(rotation[1]);
  const [scaleXVal, setScaleXVal] = useState(scale[0]);
  const [scaleYVal, setScaleYVal] = useState(scale[1]);
  const [shearXVal, setShearXVal] = useState(shear[0]);
  const [shearYVal, setShearYVal] = useState(shear[1]);

  useEffect(() => {
    // This code will run whenever shapes state changes
    console.log(transformation.x);
    document.getElementById("selectedObjectId").value = selectedShapeId;
    document.getElementById("translateXSlider").value = transformation.x;
    document.getElementById("translateYSlider").value = transformation.y;
    document.getElementById("rotateXSlider").value = transformation.rx;
    document.getElementById("rotateYSlider").value = transformation.ry;
    document.getElementById("scaleXSlider").value = transformation.sx;
    document.getElementById("scaleYSlider").value = transformation.sy;
    document.getElementById("shearXSlider").value = transformation.shx;
    document.getElementById("shearYSlider").value = transformation.shy;
    setTranslateXVal(transformation.x);
    setTranslateYVal(transformation.y);
    setRotateXVal(transformation.rx);
    setRotateYVal(transformation.ry);
    setScaleXVal(transformation.sx);
    setScaleYVal(transformation.sy);
    setShearXVal(transformation.shx);
    setShearYVal(transformation.shy)
  }, [tick]); // Watch for changes in shapes state

  const updateTransformation = () => {
    transformation.setTranslation(translateXVal, translateYVal)
    transformation.setRotation(rotateXVal, rotateYVal)
    transformation.setScale(scaleXVal, scaleYVal)
    transformation.setShear(shearXVal, shearYVal)
    setTransformation(transformation)
    // transformation.print()
  }


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
              <select onChange={(e) => setSelectedShapeId(e.target.value)} id="selectedObjectId">
                {shapes?.map((shape) => {
                  // console.log(shape.id);
                  return (
                    <option value={shape.id} key={shape.id}>
                      {shape.getName()}
                    </option>
                  );
                })}
              </select>
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
                  id="scaleYSlider"
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
}

export default Properties;
