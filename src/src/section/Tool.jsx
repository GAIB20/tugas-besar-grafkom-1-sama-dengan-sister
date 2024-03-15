function Tool({lineClick, rectClick, polyClick, squareClick}) {
  return (
    <>
      <div className="toolbar">
        <button onClick={() => {lineClick()}} className="toolbarButton">
          <img className="toolbarButtonImage" src="line.png" />
        </button>
        <button onClick={() => {rectClick()}} className="toolbarButton">
          <img className="toolbarButtonImage" src="rectangle.png" />
        </button>
        <button onClick={() => {polyClick()}} className="toolbarButton">
          <img className="toolbarButtonImage" src="polygon.png" />
        </button>
        <button onClick={() => {squareClick()}} className="toolbarButton">
          <img className="toolbarButtonImage" src="square.png" />
        </button>
      </div>
    </>
  );
}

export default Tool;
