import { Point } from "../model/point"

export class Square{
    constructor(p1, p3){
        this.p1 = p1
        this.p3 = p3
        const distance =
        Math.abs(this.p1.x - this.p2.x) > Math.abs(this.p1.y - this.p2.y)
          ?  Math.abs(this.p1.x - this.p2.x)
          :  Math.abs(this.p1.y - this.p2.y)        
        this.p2 = new Point(p1.x, p3.y)
        this.p4 = new Point(p3.x, p1.y)
    }
}