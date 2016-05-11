var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

babelHelpers;

//import * as E from './universal/mathFunctions';
//import { Point, Circle } from './universal/universalElements';

// * ***********************************************************************
// *
// *  RENDERER CLASS
// *
// *  Controller for THREE.js
// *************************************************************************
var Renderer = function () {
  function Renderer(renderElem) {
    babelHelpers.classCallCheck(this, Renderer);

    this.scene = new THREE.Scene();
    this.initCamera();
    this.initRenderer(renderElem);
    this.showStats();
    this.resize();
  }

  Renderer.prototype.add = function add(mesh) {
    this.scene.add(mesh);
  };

  Renderer.prototype.reset = function reset() {
    this.clearScene();
    this.pattern = null; //reset materials;
    this.setCamera();
    this.setRenderer();
  };

  Renderer.prototype.resize = function resize() {
    var _this = this;

    window.addEventListener('resize', function () {
      _this.renderer.setSize(window.innerWidth, window.innerHeight);
      _this.camera.aspect = window.innerWidth / window.innerHeight;
      _this.camera.updateProjectionMatrix();
    }, false);
  };

  Renderer.prototype.clearScene = function clearScene() {
    for (var i = this.scene.children.length - 1; i >= 0; i--) {
      var object = this.scene.children[i];
      if (object.type === 'Mesh') {
        object.geometry.dispose();
        object.material.dispose();
        this.scene.remove(object);
      }
    }
  };

  Renderer.prototype.initCamera = function initCamera() {
    this.camera = new THREE.OrthographicCamera();
    this.setCamera();
    this.scene.add(this.camera);
  };

  Renderer.prototype.setCamera = function setCamera() {
    this.camera.left = -window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = -window.innerHeight / 2;
    this.camera.near = -2;
    this.camera.far = 1;
    this.camera.frustumCulled = false;
    this.camera.updateProjectionMatrix();
  };

  Renderer.prototype.initRenderer = function initRenderer(renderElem) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    });
    if (renderElem) {
      this.renderer.domElement = renderElem;
    } else {
      document.body.appendChild(this.renderer.domElement);
    }
    this.setRenderer();
  };

  Renderer.prototype.setRenderer = function setRenderer() {
    this.renderer.setClearColor(0x000000, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  //render to image elem


  Renderer.prototype.renderToImageElem = function renderToImageElem(elem) {
    this.renderer.render(this.scene, this.camera);
    this.appendImageToDom(elem);
    this.clearScene();
  };

  //allows drawing of the image once adding this image to DOM elem


  Renderer.prototype.appendImageToDom = function appendImageToDom(elem) {
    document.querySelector(elem).setAttribute('src', this.renderer.domElement.toDataURL());
  };

  //Download the canvas as a png image


  Renderer.prototype.downloadImage = function downloadImage() {
    var link = document.querySelector('#download-image');
    link.href = this.renderer.domElement.toDataURL();
    link.download = 'hyperbolic-tiling.png';
  };

  //convert the canvas to a base64URL and send to saveImage.php


  Renderer.prototype.saveImage = function saveImage() {
    var data = this.renderer.domElement.toDataURL();
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'saveImage.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send('img=' + data);
  };

  Renderer.prototype.addBoundingBoxHelper = function addBoundingBoxHelper(mesh) {
    var box = new THREE.BoxHelper(mesh);
    //box.update();
    this.scene.add(box);
  };

  //include https://github.com/mrdoob/stats.js/blob/master/build/stats.min.js


  Renderer.prototype.showStats = function showStats() {
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
  };

  Renderer.prototype.render = function render() {
    //window.requestAnimationFrame(() => this.render());
    if (this.stats) this.stats.update();
    this.renderer.render(this.scene, this.camera);
  };

  return Renderer;
}();

/* UNUSED FUNCTIONS
  createMesh(geometry, color, textures, materialIndex, wireframe, elem) {
    if (wireframe === undefined) wireframe = false;
    if (color === undefined) color = 0xffffff;
    return new THREE.Mesh(geometry, this.pattern.materials[materialIndex]);
  }


  segment(circle, startAngle, endAngle, color) {
    if (color === undefined) color = 0xffffff;

    const curve = new THREE.EllipseCurve(
      circle.centre.x * this.radius,
      circle.centre.y * this.radius,
      circle.radius * this.radius,
      circle.radius * this.radius, // xRadius, yRadius
      startAngle, endAngle,
      false // aClockwise
    );

    const points = curve.getSpacedPoints(100);

    const path = new THREE.Path();
    const geometry = path.createGeometry(points);

    const material = new THREE.LineBasicMaterial({
      color: color
    });
    const s = new THREE.Line(geometry, material);

    this.scene.add(s);
  }

  line(start, end, color) {
    if (color === undefined) color = 0xffffff;

    const geometry = new THREE.Geometry();

    geometry.vertices.push(
      new THREE.Vector3(start.x * this.radius, start.y * this.radius, 0),
      new THREE.Vector3(end.x * this.radius, end.y * this.radius, 0)
    );
    const material = new THREE.LineBasicMaterial({
      color: color
    });
    const l = new THREE.Line(geometry, material);
    this.scene.add(l);
  }
*/

// * ***********************************************************************
// *
// *  LAYOUT CONTROLLER CLASS
// *
// *  controls position/loading/hiding etc.
// *************************************************************************
var LayoutController = function () {
  function LayoutController() {
    babelHelpers.classCallCheck(this, LayoutController);

    this.setupLayout();
  }

  LayoutController.prototype.setupLayout = function setupLayout() {};

  LayoutController.prototype.onResize = function onResize() {};

  LayoutController.prototype.bottomPanel = function bottomPanel() {};

  LayoutController.prototype.hideElements = function hideElements() {
    for (var _len = arguments.length, elements = Array(_len), _key = 0; _key < _len; _key++) {
      elements[_key] = arguments[_key];
    }

    for (var _iterator = elements, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var element = _ref;

      document.querySelector(element).classList.add('hide');
    }
  };

  LayoutController.prototype.showElements = function showElements() {
    for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      elements[_key2] = arguments[_key2];
    }

    for (var _iterator2 = elements, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var element = _ref2;

      document.querySelector(element).classList.remove('hide');
    }
  };

  return LayoutController;
}();

var randomFloat = function (min, max) {
  return Math.random() * (max - min) + min;
};

var randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//The following three functions convert values from percentages starting at
//(0,0) bottom left to (100,100) top right screen coords
var xPercent = window.innerWidth / 100;
var yPercent = window.innerHeight / 100;
var xCoord = function (x) {
  return x < 50 ? (-50 + x) * xPercent : (x - 50) * xPercent;
};
var yCoord = function (y) {
  return y < 50 ? (-50 + y) * yPercent : (y - 50) * yPercent;
};

// * ***********************************************************************
// *
// *  OBJECTS SUPERCLASS
// *
// *************************************************************************

var Objects = function () {
  function Objects(spec) {
    babelHelpers.classCallCheck(this, Objects);

    spec.color = spec.color || 0xffffff;
    this.spec = spec;
  }

  Objects.prototype.createMeshMaterial = function createMeshMaterial() {
    return new THREE.MeshBasicMaterial({
      color: this.spec.color
    });
  };

  Objects.prototype.createLineMaterial = function createLineMaterial() {
    return new THREE.LineBasicMaterial({
      color: this.spec.color
    });
  };

  Objects.prototype.createMesh = function createMesh(x, y, geometry, material) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = x;
    mesh.position.y = y;
    return mesh;
  };

  return Objects;
}();

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


var Disk = function (_Objects) {
  babelHelpers.inherits(Disk, _Objects);

  function Disk(spec) {
    var _ret;

    babelHelpers.classCallCheck(this, Disk);

    var _this = babelHelpers.possibleConstructorReturn(this, _Objects.call(this, spec));

    var geometry = new THREE.CircleGeometry(spec.radius, 100, 0, 2 * Math.PI);
    var material = _this.createMeshMaterial(spec.color);
    return _ret = _this.createMesh(spec.x, spec.y, geometry, material), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  return Disk;
}(Objects);
// * ***********************************************************************
// *
// *  ARC CLASS
// *
// *************************************************************************
var Arc = function (_Objects2) {
  babelHelpers.inherits(Arc, _Objects2);

  function Arc(spec) {
    var _ret2;

    babelHelpers.classCallCheck(this, Arc);

    var _this2 = babelHelpers.possibleConstructorReturn(this, _Objects2.call(this, spec));

    spec.rotation = spec.rotation || 0;
    spec.clockwise = spec.rotation || false;
    spec.points = spec.points || 50;

    var material = _this2.createLineMaterial(spec.color);
    var curve = new THREE.EllipseCurve(spec.x, spec.y, spec.xRadius, spec.yRadius, spec.startAngle, spec.endAngle, spec.clockwise, spec.rotation);

    var path = new THREE.Path(curve.getPoints(spec.points));
    var geometry = path.createPointsGeometry(spec.points);
    return _ret2 = new THREE.Line(geometry, material), babelHelpers.possibleConstructorReturn(_this2, _ret2);
  }

  return Arc;
}(Objects);
// * ***********************************************************************
// *
// * SPLINE CLASS
// *
// *************************************************************************
var Spline = function (_Objects3) {
  babelHelpers.inherits(Spline, _Objects3);

  function Spline(spec) {
    var _ret3;

    babelHelpers.classCallCheck(this, Spline);

    var _this3 = babelHelpers.possibleConstructorReturn(this, _Objects3.call(this, spec));

    spec.points = spec.points || 50;
    var material = _this3.createLineMaterial(spec.color);
    var curve = new (Function.prototype.bind.apply(THREE.CubicBezierCurve3, [null].concat(spec.vectors)))();
    var geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(spec.points);
    //const path = new THREE.Path(curve.getPoints(spec.points));
    //const geometry = path.createPointsGeometry(spec.points);
    return _ret3 = new THREE.Line(geometry, material), babelHelpers.possibleConstructorReturn(_this3, _ret3);
  }

  return Spline;
}(Objects);

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
var Spiral = function (_Objects4) {
  babelHelpers.inherits(Spiral, _Objects4);

  function Spiral(spec) {
    babelHelpers.classCallCheck(this, Spiral);

    var _this4 = babelHelpers.possibleConstructorReturn(this, _Objects4.call(this, spec));

    spec.points = spec.points || 50;

    _this4.pointsAlongSpiral = _this4.points(spec.direction, spec.limit, spec.density);
    return _this4;
  }

  //calculate a point on the spiral using parametric equations


  Spiral.prototype.point = function point(t) {
    var r = this.spec.a * Math.exp(this.spec.b * t);
    return {
      x: xCoord(r * Math.cos(t) + 50),
      y: yCoord(r * Math.sin(t) + 50)
    };
  };

  //return an array of vector objects along the spiral


  Spiral.prototype.points = function points() {
    var direction = arguments.length <= 0 || arguments[0] === undefined ? 'to-centre' : arguments[0];
    var limit = arguments.length <= 1 || arguments[1] === undefined ? 50 : arguments[1];
    var density = arguments.length <= 2 || arguments[2] === undefined ? 0.5 : arguments[2];

    var vectors = [];
    if (direction === 'to-centre') {
      for (var i = limit; i > 0; i--) {
        var pt = this.point(i * density);
        vectors.push(new THREE.Vector3(pt.x, pt.y, 0));
      }
    } else {
      for (var _i = 0; _i < limit; _i++) {
        var _pt = this.point(_i * density);
        vectors.push(new THREE.Vector3(_pt.x, _pt.y, 0));
      }
    }

    return vectors;
  };

  return Spiral;
}(Objects);

// * ***********************************************************************
// *
// * WIGGLY SPIRAL CLASS
// *
// * Extends spiral class by joins points with cubic beziers
// *
// *************************************************************************
var WigglySpiral = function (_Spiral) {
  babelHelpers.inherits(WigglySpiral, _Spiral);

  function WigglySpiral(spec) {
    babelHelpers.classCallCheck(this, WigglySpiral);

    var _this5 = babelHelpers.possibleConstructorReturn(this, _Spiral.call(this, spec));

    _this5.wigglyCurve();
    return _this5;
  }

  WigglySpiral.prototype.wigglyCurve = function wigglyCurve() {
    this.curves = [];
    for (var i = 0; i < this.pointsAlongSpiral.length - 1; i++) {
      var curve = new THREE.CubicBezierCurve3(new THREE.Vector3(this.pointsAlongSpiral[i].x, this.pointsAlongSpiral[i].y, 0), new THREE.Vector3(-5, 15, 0), new THREE.Vector3(20, 15, 0), new THREE.Vector3(this.pointsAlongSpiral[i + 1].x, this.pointsAlongSpiral[i + 1].y, 0));
      geometry = new THREE.Geometry();
      geometry.vertices = curve.getPoints(50);
      var material = this.createLineMaterial();
      this.curves.push(new THREE.Line(geometry, material));
    }
  };

  return WigglySpiral;
}(Spiral);

// * ***********************************************************************
// *
// *  DRAWING CLASS
// *
// *  Here we will create some pretty things
// *
// *************************************************************************

var Drawing = function () {
  function Drawing(renderer) {
    babelHelpers.classCallCheck(this, Drawing);

    this.renderer = renderer;
    this.test();
  }

  Drawing.prototype.drawSpiral = function drawSpiral() {
    var spiral = new WigglySpiral({
      a: randomFloat(0.1, 0.8),
      b: randomFloat(0.3, 0.8),
      color: randomInt(0x400000, 0xffffff)
    });
    //a: 0.3,
    //b: 0.5,
    for (var _iterator = spiral.curves, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var curve = _ref;

      this.renderer.add(curve);
    }
  };

  Drawing.prototype.test = function test() {
    for (var i = 0; i < 1; i++) {
      this.drawSpiral();
    }
  };

  return Drawing;
}();

// * ***********************************************************************
// *
// *  CONTROLLER CLASS
// *
// *************************************************************************
var Controller = function () {
  function Controller() {
    babelHelpers.classCallCheck(this, Controller);

    this.layout = new LayoutController();
    this.renderer = new Renderer();

    //document.querySelector('#canvas') //NOT WORKING!!
    this.drawing = new Drawing(this.renderer);
    this.init();
  }

  Controller.prototype.init = function init() {
    var _this = this;

    //this.renderer.render();
    //This will use GSAP rAF instead of THREE.js
    //also remove request animation frame from render function!
    TweenMax.ticker.addEventListener('tick', function () {
      return _this.renderer.render();
    });
  };

  Controller.prototype.onResize = function onResize() {};

  //to use this add buttons with the classes below


  Controller.prototype.saveImageButtons = function saveImageButtons() {
    var _this2 = this;

    document.querySelector('#save-image').onclick = function () {
      return _this2.render.saveImage();
    };
    document.querySelector('#download-image').onclick = function () {
      return _this2.render.downloadImage();
    };
  };

  return Controller;
}();

// * ***********************************************************************
// *
// *   POLYFILLS
// *
// *************************************************************************

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

var controller = void 0;
window.onload = function () {
  controller = new Controller();
};

window.onresize = function () {
  controller.onResize();
};