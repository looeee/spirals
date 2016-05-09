import * as E from './mathFunctions';

// * ***********************************************************************
// *
// *   POINT CLASS
// *   Represents a 2D or 3D point with functions to apply transforms and
// *   convert between hyperbolid space and the Poincare disk
// *************************************************************************

export class Point {
  constructor(x, y, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  //compare two points taking rounding errors into account
  compare(otherPoint) {
    if (typeof otherPoint === 'undefined') {
      console.warn('Compare Points: point not defined.');
      return false;
    }
    const a = E.toFixed(this.x) === E.toFixed(otherPoint.x);
    const b = E.toFixed(this.y) === E.toFixed(otherPoint.y);
    const c = E.toFixed(this.z) === E.toFixed(otherPoint.z);
    if (a && b && c) return true;
    return false;
  }

  clone() {
    return new Point(this.x, this.y);
  }
}

// * ***********************************************************************
// *
// *   CIRCLE CLASS
// *   A circle in the Poincare disk is identical to a circle in Euclidean space
// *
// *************************************************************************

export class Circle {
  constructor(centreX, centreY, radius) {
    this.centre = new Point(centreX, centreY);
    this.radius = radius;
  }
}
