
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


// ========= CONVEX HULL ==============

// Method to find the convex hull using the Divide and Conquer Algorithm
export const makeConvexHull = (points) => {
  if (points.length < 3) {
    return points;
  }

  points.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));

  const upper = [];
  const lower = [];

  for (const point of points) {
    while (
      upper.length >= 2 &&
      isNotRightTurn(
        upper[upper.length - 2],
        upper[upper.length - 1],
        point
      )
    ) {
      upper.pop();
    }
    upper.push(point);
  }

  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    while (
      lower.length >= 2 &&
      isNotRightTurn(
        lower[lower.length - 2],
        lower[lower.length - 1],
        point
      )
    ) {
      lower.pop();
    }
    lower.push(point);
  }

  const hull = new Set([...upper, ...lower]);
  return Array.from(hull);
}

// Function to check the correct direction
const isNotRightTurn = (a, b, c) => {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) <= 0;
}

// MANIPULATION TYPE OF ARRAY OF POINTS

export const convertPointToCoordinates = (points) => {
  const results = [];
  for (let i = 0; i < points.length; i++) {
    results.push(points[i].x, points[i].y);
  }
  return results;
};

export const convertPointToPairs = (points) => {
  // From Point data type to [x, y]
  const results = [];
  for (let i = 0; i < points.length; i++) {
    results.push([points[i].x, points[i].y]);
  }
  return results;
};

export const convertPairsToCoordinates = (points) => {
  // From data type [[x, y],[z,..]] to [x, y, z, ..]
  const results = [];
  for (let i = 0; i < points.length; i++) {
    results.push(points[i][0], points[i][1]);
  }
  return results;
};

export const isPointInConvexHull = (point, convexHull) => {
  for(var i = 0; i < convexHull.length; i++){
    if (isPointPairTheSame(point, convexHull[i])){
      return true
    }
  }
  return false  
}

const isPointPairTheSame = (point, pair) => {
  return Math.floor(point.x) == Math.floor(pair[0]) && Math.floor(point.y) == Math.floor(pair[1])
}

export const getIdxXYFromPairArray = (x, y, pairs) => {
  for (var i = 0; i < pairs.length ; i++){
    if (pairs[i][0] == x && pairs[i][1] == y){
      console.log("TRUE")
      return i
    }
  }
  return undefined
}
