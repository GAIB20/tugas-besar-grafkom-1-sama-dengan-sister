export class TransformationMatrix {
  constructor(firstRow, secondRow, thirdRow) {
    this.matrix = [firstRow, secondRow, thirdRow];
    this.firstRow = firstRow;
    this.secondRow = secondRow;
    this.thirdRow = thirdRow;
  }

  multiplyMatrix(anotherMatrix) {
    const results = [];
    const firstRow = this.multiplyRowCol(this.firstRow, anotherMatrix);
    const secondRow = this.multiplyRowCol(this.secondRow, anotherMatrix);
    const thirdRow = this.multiplyRowCol(this.thirdRow, anotherMatrix);

    results.push(firstRow, secondRow, thirdRow);
    return results;
  }

  multiplyRowCol(row, col) {
    let result = 0;
    for (let i = 0; i < row.length; i++) {
      result += row[i] * col[i];
    }
    return result;
  }
}
