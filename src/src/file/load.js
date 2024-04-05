import { Color } from "../model/color";
import { Point } from "../model/point";
import { Line } from "../shapes/line";
import { Polygon } from "../shapes/polygon";
import { Rectangle } from "../shapes/rectangle";
import { Square } from "../shapes/square";
import Transformation from "../utils/transformation";

const stringToPoints = (vertices) => {
  const results = [];
  for (let i = 0; i < vertices.length; i++) {
    results[i] = new Point(
      vertices[i].x,
      vertices[i].y,
      new Color(
        vertices[i].color.r,
        vertices[i].color.g,
        vertices[i].color.b,
        vertices[i].color.a
      )
    );
  }
  console.log("Ini results ; ", results);
  return results;
};

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
    switch (type) {
      case "Square":
        {
          const square = new Square({
            vertices: vertices,
            id: id,
            transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0),
            fromFile: true,
            canvasCenter: canvasCenter,
          });
          shapes.push(square);
        }

        break;
      case "Rectangle": {
        const rectangle = new Rectangle({
          vertices: vertices,
          id: id,
          transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0, 0),
          fromFile: true,
          canvasCenter: canvasCenter,
        });
        shapes.push(rectangle);
        break;
      }
      case "Line": {
        const line = new Line({
          origin: vertices[0],
          final: vertices[1],
          id,
          transformation: new Transformation(0, 0, 0, 0, 0, 0, 0, 0, 0),
          canvasCenter: canvasCenter,
          fromFile: true,
        });
        shapes.push(line);
        break;
      }
      case "Polygon": {
        const points = stringToPoints(vertices);
        const polygon = new Polygon(
          points,
          id,
          new Transformation(0, 0, 0, 0, 0, 0, 0, 0, 0),
          canvasCenter
        );
        shapes.push(polygon);
        break;
      }
      default:
        break;
    }
    id += 1;
  }
  console.log("Ini shapes :", shapes);
  return shapes;
};
