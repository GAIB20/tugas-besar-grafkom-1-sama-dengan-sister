export class DrawableObject {
    constructor(id, type) {
        this.id = id;
        this.type = type;
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