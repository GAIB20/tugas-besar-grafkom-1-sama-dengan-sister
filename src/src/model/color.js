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

    toArray() {
      return [parseInt(this.r) / 255, parseInt(this.g) / 255, parseInt(this.b) / 255, parseFloat(this.a)];
    }

    toHex() {
      return (1 << 24 | this.r << 16 | this.g << 8 | this.b).toString(16).slice(1);
    }

    updateHex(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      this.r = parseInt(result[1], 16),
      this.g = parseInt(result[2], 16),
      this.b =  parseInt(result[3], 16)
      
    }
    
}