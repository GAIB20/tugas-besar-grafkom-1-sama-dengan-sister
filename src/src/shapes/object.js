export class DrawableObject {
    constructor(id, type, color) {
        this.id = id;
        this.type = type;
        this.color = color;
    }
    getName() {
      return this.type + " " + this.id;
    }
    
    getID() {
      return this.id;
    }

    getType(){
      return this.type
    }
}