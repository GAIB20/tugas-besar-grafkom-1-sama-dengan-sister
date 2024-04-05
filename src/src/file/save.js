const convertPointToObject = (points) => {
  const results = [];
  for (let i = 0; i < points.length; i++) {
    const point = {
      x: points[i].x,
      y: points[i].y,
      color : points[i].color
    };
    results.push(point);
  }
  return results;
};
export const saveModels = (shapes) => {
  console.log(shapes);
  const items = [];
  for (let i = 0; i < shapes.length; i++) {
    const vertices = convertPointToObject(shapes[i].vertices);
    const item = {
      id: shapes[i].id,
      vertices: vertices,
      type: shapes[i].getType(),
    };
    items.push(item);
  }
  return JSON.stringify(items, null, 2);
};

export const downloadModel = (shapes) => {
  const shapesJson = saveModels(shapes);
  const blob = new Blob([shapesJson], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "shapes.txt";
  link.href = url;
  document.body.appendChild(link); // Menambahkan link ke dokumen
  link.click(); // Men-trigger klik untuk memulai download
  document.body.removeChild(link); // Membersihkan dengan menghapus link
  URL.revokeObjectURL(url); // Membersihkan URL dari memori
};
