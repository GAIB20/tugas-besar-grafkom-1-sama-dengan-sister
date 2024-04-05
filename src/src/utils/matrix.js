class Matrix {
  // Attributes
  // this.rows
  // this.cols
  // this.mat

  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.mat = [];
    for (let i = 0; i < this.rows; i++) {
      this.mat[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.mat[i][j] = 0;
      }
    }
  }

  getMatrix = () => {
    return this.mat;
  };

  getRows = () => {
    return this.rows;
  };

  getCols = () => {
    return this.cols;
  };

  insertMatrix = (m) => {
    // Ini dipakai kalau tipe bentukan m adalah Array of Array
    this.rows = m.length;
    if (m[0]) {
      this.cols = m[0].length;
    } else {
      this.cols = 0;
    }

    this.mat = [];
    for (let i = 0; i < this.rows; i++) {
      this.mat[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.mat[i][j] = m[i][j];
      }
    }
  };

  copyMatrix = (m) => {
    // Ini dipakai kalau tipe bentukan m juga berupa Data Type Matrix
    this.rows = m.rows;
    this.cols = m.cols;

    this.mat = [];
    for (let i = 0; i < this.rows; i++) {
      this.mat[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.mat[i][j] = m[i][j];
      }
    }
  };

  transpose = () => {
    var tempR = this.rows;
    var tempC = this.cols;
    this.rows = tempC;
    this.cols = tempR;

    var temp = [];
    for (let i = 0; i < this.rows; i++) {
      temp[i] = [];
      for (let j = 0; j < this.cols; j++) {
        temp[i][j] = this.mat[j][i];
      }
    }
    this.mat = temp;
  };

  concatRow = (m) => {
    for (let i = this.rows; i < this.rows + m.rows; i++) {
      this.mat[i] = m.mat[i - this.rows];
    }
    this.rows += m.rows;
  };

  concatCol = (m) => {
    m.transpose();
    this.transpose();
    this.concatRow(m);
    this.transpose();
    m.transpose();
  };

  // Make Matrix
  makeIdentityMatrix = () => {
    if (this.rows != this.cols) {
      console.error("Is not a square matrix");
      return;
    } else {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          if (i == j) {
            this.mat[i][j] = 1;
          } else {
            this.mat[i][j] = 0;
          }
        }
      }
    }
  };

  multiplyMatrix = (m) => {
    // M adalah tipe bentukan Matrix
    if (this.cols != m.getRows()) {
      console.log("Cannot be multiplied");
    } else {
      var tempMat = m.getMatrix();
      var result = [];
      for (var i = 0; i < this.rows; i++) {
        result[i] = [];
        for (var j = 0; j < m.getCols(); j++) {
          var sum = 0;
          for (var k = 0; k < this.cols; k++) {
            sum += this.mat[i][k] * tempMat[k][j];
          }
          result[i][j] = sum;
        }
      }
      this.mat = result;
    }
  };

  printMatrix = () => {
    console.log("Rows:", this.rows);
    console.log("Cols:", this.cols);
    console.log(this.mat);
  };
}

export default Matrix;

export function multiplyMatrices(matrix1, matrix2) {
  if (matrix1[0].length !== matrix2.length) {
    console.error("Matrix dimensions are not compatible for multiplication.");
    return;
  }

  var result = [];
  for (var i = 0; i < matrix1.length; i++) {
    result[i] = [];
    for (var j = 0; j < matrix2[0].length; j++) {
      var sum = 0;
      for (var k = 0; k < matrix1[0].length; k++) {
        sum += matrix1[i][k] * matrix2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}
