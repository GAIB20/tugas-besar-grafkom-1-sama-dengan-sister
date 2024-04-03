
export const canvasX = (canvas, x) => {
  const rect = canvas.getBoundingClientRect();
  let newX = x - rect.left;
  newX = (newX / (rect.right - rect.left)) * canvas.width;
  return newX;
};

export const canvasY = (canvas, y) => {
  const rect = canvas.getBoundingClientRect();
  let newY = y - rect.top;
  newY = (newY / (rect.bottom - rect.top)) * canvas.height;
  return newY;
};

