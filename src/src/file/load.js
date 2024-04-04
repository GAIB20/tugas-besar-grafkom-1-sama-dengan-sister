import { Rectangle } from "../shapes/rectangle";
import { Square } from "../shapes/square";
import Transformation from "../utils/transformation";

export const parseFile = (content) => {
  const contextJson = JSON.parse(content);
  console.log("Ini contextJson", contextJson);
  const shapes = [];
  const canvas = document.querySelector("canvas");
  var rect = canvas.getBoundingClientRect();
  const canvasCenter = [
    (rect.right - rect.left) / 2,
    (rect.bottom - rect.top) / 2,
  ];
  console.log(contextJson.length);
  for (let i = 0; i < contextJson.length; i++) {
    const shape = contextJson[i];
    console.log("Ini shape context json : ", shape);
    const id = shape.id;
    const type = shape.type;
    const vertices = shape.vertices;
    const color = shape.color;
    if (type === "Square") {
      const square = new Square({
        vertices: vertices,
        id: id,
        color: color,
        transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0),
        fromFile: true,
        canvasCenter: canvasCenter,
      });

      shapes.push(square);
    }
    if (type === "Rectangle") {
      console.log("Masuk ke rectangle");
      const rectangle = new Rectangle({
        vertices: vertices,
        id: id,
        color: color,
        transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0, 0),
        fromFile: true,
        canvasCenter: canvasCenter,
      });
      shapes.push(rectangle);
    }
  }
  return shapes;
};
