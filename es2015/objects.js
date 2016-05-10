import {
  xCoord,
  yCoord,
  length,
}
from './utility';
// * ***********************************************************************
// *
// *  OBJECTS SUPERCLASS
// *
// *************************************************************************
class Objects {
  constructor(spec) {
    spec.color = spec.color || 0xffffff;
  }

  createMeshMaterial(color) {
    return new THREE.MeshBasicMaterial({
      color,
    });
  }

  createLineMaterial(color) {
    return new THREE.LineBasicMaterial({
      color,
    });
  }

  createMesh(x, y, geometry, material) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = x;
    mesh.position.y = y;
    return mesh;
  }
}

// * ***********************************************************************
// *
// *  DISK CLASSES
// *
// *************************************************************************
// spec = {
//   radius,
//   color,
//   x,
//   y
// }
export class Disk extends Objects {
  constructor(spec) {
    super(spec);
    const geometry = new THREE.CircleGeometry(spec.radius, 100, 0, 2 * Math.PI);
    const material = this.createMeshMaterial(spec.color);
    return this.createMesh(spec.x, spec.y, geometry, material);
  }
}
// * ***********************************************************************
// *
// *  ARC CLASS
// *
// *************************************************************************
export class Arc extends Objects {
  constructor(spec) {
    super(spec);

    spec.rotation = spec.rotation || 0;
    spec.clockwise = spec.rotation || false;
    spec.points = spec.points || 50;

    const material = this.createLineMaterial(spec.color);
    const curve = new THREE.EllipseCurve(
      spec.x, spec.y,
      spec.xRadius, spec.yRadius,
      spec.startAngle, spec.endAngle,
      spec.clockwise,
      spec.rotation
    );

    const path = new THREE.Path(curve.getPoints(spec.points));
    const geometry = path.createPointsGeometry(spec.points);
    return new THREE.Line(geometry, material);
  }
}
// * ***********************************************************************
// *
// * SPLINE CLASS
// *
// *************************************************************************
export class Spline extends Objects {
  constructor(spec) {
    super(spec);
    spec.points = spec.points || 50;
    const material = this.createLineMaterial(spec.color);
    const curve = new THREE.CubicBezierCurve3(...spec.vectors);
    const geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(spec.points);
    //const path = new THREE.Path(curve.getPoints(spec.points));
    //const geometry = path.createPointsGeometry(spec.points);
    return new THREE.Line(geometry, material);
  }
}

// * ***********************************************************************
// *
// * (logarithmic) SPIRAL CLASS
// *
// * Will start at screens edge and spiral towards the centre
// *
// *************************************************************************
// spec = {
//   a: 5, b: 2 // arbitrary constants
// }
export class Spiral extends Objects {
  constructor(spec) {
    super(spec);
    spec.points = spec.points || 50;

    this.spec = spec;

    return this.pointsTEST();
  }

  //calculate a point on the spiral using parametric equations
  point(t) {
    const r = this.spec.a * Math.exp(this.spec.b * t);
    return {
      x: xCoord(r * Math.cos(t) + 50),
      y: yCoord(r * Math.sin(t) + 50),
    };
  }

  //calculate the point at the edge of the screen
  firstPoint() {
    const edge = 90;
    const theta = Math.log(edge / this.spec.a) / this.spec.b;
    const hyp = edge / Math.cos(theta);
    const y = yCoord(Math.sqrt(Math.pow(hyp, 2) - Math.pow(edge, 2)));
    const x = xCoord(edge);
    return new Disk({
      x,
      y,
      radius: 20,
      color: 0xff0000,
    });
  }

  //calculate a set of points along the spiral
  spacedPoints() {
    const points = [];
    for (let i = 100; i > 0; i -= 1) {
      const theta = Math.log(i / this.spec.a) / this.spec.b;
      const hyp = i / Math.cos(theta);
      const y = yCoord(Math.sqrt(Math.pow(hyp, 2) - Math.pow(i, 2)));
      const x = xCoord(i);
      points.push(
        new Disk({
          x,
          y,
          radius: 2,
          color: 0xfffff,
        })
      );
    }
    return {
      points,
    };
  }


  //return an array of disk objects along the spiral
  pointsTEST() {
    const points = [];
    const vectors = [];
    for (let i = 200; i > 0; i--) {
      const pt = this.point(i / 2);
      points.push(
        new Disk({
          radius: 1,
          x: pt.x, //adding 50 here centres the spiral
          y: pt.y,
        })
      );
      vectors.push(new THREE.Vector3(pt.x, pt.y, 0));
    }

    const curve = new THREE.CatmullRomCurve3(vectors);
    const path = new THREE.Path(curve.getPoints(300));
    const geometry = path.createPointsGeometry(300);
    const material = this.createLineMaterial(0xffffff);
    return {
      firstPoint: this.firstPoint(),
      points,
      curve: new THREE.Line(geometry, material),
    };
  }
}
