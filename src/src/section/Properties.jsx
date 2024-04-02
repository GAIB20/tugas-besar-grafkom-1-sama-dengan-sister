import { useState } from "react";

const SLIDER_STEPS = 0.01;
const SLIDER_MIN = 0;
const SLIDER_MAX = 1;

function Properties() {
  const [propsOpen, setPropsOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  // TO DO: Change to Default Value
  const [translateXVal, setTranslateXVal] = useState(0);
  const [translateYVal, setTranslateYVal] = useState(0);
  const [translateZVal, setTranslateZVal] = useState(0);
  const [rotateXVal, setRotateXVal] = useState(0);
  const [rotateYVal, setRotateYVal] = useState(0);
  const [rotateZVal, setRotateZVal] = useState(0);
  const [scaleVal, setScaleVal] = useState(0);
  const [shearXVal, setShearXVal] = useState(0);
  const [shearYVal, setShearYVal] = useState(0);
  const [shearZVal, setShearZVal] = useState(0);

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
                  onChange={(e) => setTranslateXVal(e.target.value)}
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
                  onChange={(e) => setTranslateYVal(e.target.value)}
                />
              </div>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Translate Z &nbsp; &nbsp; {translateZVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="translateZSlider"
                  step={SLIDER_STEPS}
                  defaultValue={translateZVal}
                  onChange={(e) => setTranslateZVal(e.target.value)}
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
                  onChange={(e) => setRotateXVal(e.target.value)}
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
                  onChange={(e) => setRotateYVal(e.target.value)}
                />
              </div>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Rotate Z &nbsp; &nbsp; {rotateZVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="rotateZSlider"
                  step={SLIDER_STEPS}
                  defaultValue={rotateZVal}
                  onChange={(e) => setRotateZVal(e.target.value)}
                />
              </div>
            </div>

            <div className="sectionContainer">
              <p className="sectionTitle"> Scale </p>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Rotate &nbsp; &nbsp; {scaleVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="scaleSlider"
                  step={SLIDER_STEPS}
                  defaultValue={rotateXVal}
                  onChange={(e) => setScaleVal(e.target.value)}
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
                  onChange={(e) => setShearXVal(e.target.value)}
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
                  onChange={(e) => setShearYVal(e.target.value)}
                />
              </div>
              <div className="slidecontainer">
                <bold>
                  {" "}
                  <p> Shear Z &nbsp; &nbsp; {shearZVal}</p>{" "}
                </bold>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  className="slider"
                  id="shearZSlider"
                  step={SLIDER_STEPS}
                  defaultValue={shearZVal}
                  onChange={(e) => setShearZVal(e.target.value)}
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
}

export default Properties;
