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
    this.spec = spec;
  }

  createMeshMaterial() {
    return new THREE.MeshBasicMaterial({
      color: this.spec.color,
    });
  }

  createLineMaterial() {
    return new THREE.LineBasicMaterial({
      color: this.spec.color,
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

    this.pointsAlongSpiral = this.points(spec.direction, spec.limit, spec.density);
  }

  //calculate a point on the spiral using parametric equations
  point(t) {
    const r = this.spec.a * Math.exp(this.spec.b * t);
    return {
      x: xCoord(r * Math.cos(t) + 50),
      y: yCoord(r * Math.sin(t) + 50),
    };
  }

  //return an array of vector objects along the spiral
  points(direction = 'to-centre', limit = 50, density = 0.5) {
    const vectors = [];
    if (direction === 'to-centre') {
      for (let i = limit; i > 0; i--) {
        const pt = this.point(i * density);
        vectors.push(new THREE.Vector3(pt.x, pt.y, 0));
      }
    }
    else {
      for (let i = 0; i < limit; i++) {
        const pt = this.point(i * density);
        vectors.push(new THREE.Vector3(pt.x, pt.y, 0));
      }
    }

    return vectors;
  }
}

// * ***********************************************************************
// *
// * WIGGLY SPIRAL CLASS
// *
// * Extends spiral class by joins points with cubic beziers
// *
// *************************************************************************
export class WigglySpiral extends Spiral {
  constructor(spec) {
    super(spec);
    this.wigglyCurve();
  }

  wigglyCurve() {
    this.curves = [];
    for (let i = 0; i < this.pointsAlongSpiral.length - 1; i++) {
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(this.pointsAlongSpiral[i].x, this.pointsAlongSpiral[i].y, 0),
        new THREE.Vector3(-5, 15, 0),
        new THREE.Vector3(20, 15, 0),
        new THREE.Vector3(this.pointsAlongSpiral[i + 1].x, this.pointsAlongSpiral[i + 1].y, 0)
      );
      geometry = new THREE.Geometry();
      geometry.vertices = curve.getPoints(50);
      const material = this.createLineMaterial();
      this.curves.push(new THREE.Line(geometry, material));
    }
  }
}
