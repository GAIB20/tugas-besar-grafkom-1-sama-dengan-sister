export class Color {
    constructor(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
  
    updateColor(color) {
        this.r = parseInt(color.r);
        this.g = parseInt(color.g);
        this.b = parseInt(color.b);
        this.a = parseFloat(color.a);
    }
}