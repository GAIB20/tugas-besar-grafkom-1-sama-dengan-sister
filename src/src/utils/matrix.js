class Matrix {
  // this.mat
  // this.rows
  // this.cols

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

  copyMatrix = (m) => {
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

    var temp = this.mat

    for (let i = 0; i < this.rows; i++) {
      this.mat[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.mat[i][j] = temp[j][i];
      }
    }
  };

  concatRow = (m) => {
    for (let i = this.rows; i < this.rows + m.rows; i++){
      this.mat[i] = m.mat[i-this.rows]
    }
    this.rows += m.rows
  }

  concatCol = (m) => {
    m.transpose()
    this.transpose()
    this.concatRow(m)
    this.transpose()
    m.transpose()
  }


  // Make Matrix
  makeIdentityMatrix = () => {
    if (this.rows == this.cols) {
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


}

export default Matrix;
