import * as E from './universal/mathFunctions';
import { Point, Circle } from './universal/universalElements';

// * ***********************************************************************
// *
// *  DRAWING CLASS
// *
// *  Here we will create some pretty things
// *
// *************************************************************************

export class Drawing {
  constructor(renderer) {
    this.renderer = renderer;
    this.test();
  }

  test() {
    const centre = new Point(0, 0);
    const circle = new Circle(centre, 100);
    console.log(circle);
    this.renderer.disk(circle);
  }
}
