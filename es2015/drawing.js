import { randomFloat, randomInt } from './universal/mathFunctions';
//import { Point, Circle } from './universal/universalElements';
import {
  Arc,
  Disk,
  Spline,
  Spiral,
  WigglySpiral,
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

  drawSpiral() {
    const spiral = new WigglySpiral({
      a: randomFloat(0.1, 0.8),
      b: randomFloat(0.3, 0.8),
      color: randomInt(0x400000, 0xffffff),
      //a: 0.3,
      //b: 0.5,
    });
    for (const curve of spiral.curves) {
      this.renderer.add(curve);
    }
  }

  test() {
    for (let i = 0; i < 1; i++) {
      this.drawSpiral();
    }
  }
}
