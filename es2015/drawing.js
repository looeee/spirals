import { randomFloat } from './universal/mathFunctions';
//import { Point, Circle } from './universal/universalElements';
import {
  Arc,
  Disk,
  Spline,
  Spiral,
}
from './objects';
import {
  xCoord as x,
  yCoord as y,
  length as l,
}
from './utility';

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
    const spiral = new Spiral({
      //a: randomFloat(0.1, 0.8),
      //b: randomFloat(0.3, 0.8),
      a: 0.3,
      b: 0.5,
    });

    for (const point of spiral.points) {
      this.renderer.add(point);
    }
    //console.log(spiral.firstPoint);
    //this.renderer.add(spiral.firstPoint);
  }
}
