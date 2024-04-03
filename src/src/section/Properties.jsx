import { useState } from "react";

const SLIDER_STEPS = 0.01;
const SLIDER_MIN = 0;
const SLIDER_MAX = 1;

const Properties = ({ transformation, isOpen, shapes, setSelectedShapeId, setTransformation }) => {
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

  const updateTransformation = () => {
    transformation.setTranslation(translateXVal, translateYVal)
    transformation.setRotation(rotateXVal, rotateYVal)
    transformation.setScale(scaleXVal, scaleYVal)
    transformation.setShear(shearXVal, shearYVal)
    transformation.print()
  }


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
              <select onChange={(e) => setSelectedShapeId(e.target.value)}>
                {shapes?.map((shape) => {
                  console.log(shape.id);
                  return (
                    <option value={shape?.id ?? ""} key={shape?.id ?? ""}>
                      {shape.getName()}
                    </option>
                  );
                })}
              </select>
              <p className="sectionTitle"> Translation </p>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Translate X &nbsp; &nbsp; {translateXVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="translateXSlider"
                  step={SLIDER_STEPS}
                  defaultValue={translateXVal}
                  onChange={(e) => {
                    setTranslateXVal(e.target.value);
                    updateTransformation();
                  }}
                />
              </div>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Translate Y &nbsp; &nbsp; {translateYVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="translateYSlider"
                  step={SLIDER_STEPS}
                  defaultValue={translateYVal}
                  onChange={(e) => {
                    setTranslateYVal(e.target.value);
                    updateTransformation();
                  }}
                />
              </div>
            </div>

            <div className="sectionContainer">
              <p className="sectionTitle"> Rotation </p>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Rotate X &nbsp; &nbsp; {rotateXVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="rotateXSlider"
                  step={SLIDER_STEPS}
                  defaultValue={rotateXVal}
                  onChange={(e) => {
                    setRotateXVal(e.target.value);
                    updateTransformation();
                  }}
                />
              </div>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Rotate Y &nbsp; &nbsp; {rotateYVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="rotateYSlider"
                  step={SLIDER_STEPS}
                  defaultValue={rotateYVal}
                  onChange={(e) => {
                    setRotateYVal(e.target.value);
                    updateTransformation();
                  }}
                />
              </div>
            </div>

            <div className="sectionContainer">
              <p className="sectionTitle"> Scale </p>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Scale X &nbsp; &nbsp; {scaleXVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="scaleSlider"
                  step={SLIDER_STEPS}
                  defaultValue={rotateXVal}
                  onChange={(e) => {
                    setScaleXVal(e.target.value)
                    updateTransformation()
                  }}
                />
              </div>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Scale Y &nbsp; &nbsp; {scaleYVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="scaleSlider"
                  step={SLIDER_STEPS}
                  defaultValue={rotateXVal}
                  onChange={(e) => {
                    setScaleYVal(e.target.value)
                    updateTransformation()
                  }}
                />
              </div>
            </div>

            <div className="sectionContainer">
              <p className="sectionTitle"> Shear </p>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Shear X &nbsp; &nbsp; {shearXVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="shearXSlider"
                  step={SLIDER_STEPS}
                  defaultValue={shearXVal}
                  onChange={(e) => {
                    setShearXVal(e.target.value);
                    updateTransformation();
                  }}
                />
              </div>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Shear Y &nbsp; &nbsp; {shearYVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="shearYSlider"
                  step={SLIDER_STEPS}
                  defaultValue={shearYVal}
                  onChange={(e) => {
                    setShearYVal(e.target.value);
                    updateTransformation();
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
