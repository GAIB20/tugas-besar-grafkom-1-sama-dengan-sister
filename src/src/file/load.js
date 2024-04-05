import { Line } from "../shapes/line";
import { Rectangle } from "../shapes/rectangle";
import { Square } from "../shapes/square";
import Transformation from "../utils/transformation";

export const parseFile = (content, lastId) => {
  const contextJson = JSON.parse(content);
  const shapes = [];
  const canvas = document.querySelector("canvas");
  var rect = canvas.getBoundingClientRect();
  const canvasCenter = [
    (rect.right - rect.left) / 2,
    (rect.bottom - rect.top) / 2,
  ];
  let id = lastId;
  for (let i = 0; i < contextJson.length; i++) {
    const shape = contextJson[i];
    const type = shape.type;
    const vertices = shape.vertices;
    if (type === "Square") {
      const square = new Square({
        vertices: vertices,
        id: id,
        transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0),
        fromFile: true,
        canvasCenter: canvasCenter,
      });
      shapes.push(square);
    }
    if (type === "Rectangle") {
      const rectangle = new Rectangle({
        vertices: vertices,
        id: id,
        transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0, 0),
        fromFile: true,
        canvasCenter: canvasCenter,
      });
      shapes.push(rectangle);
    }
    if (type === "Line") {
      const line = new Line({
        origin: vertices[0],
        final: vertices[1],
        id,
        transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0, 0),
        canvasCenter: canvasCenter,
        fromFile: true,
      });
      shapes.push(line);
    }
    id += 1;
  }
  return shapes;
};
