var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers;

// * ***********************************************************************
// *
// *   POINT CLASS
// *   Represents a 2D or 3D point with functions to apply transforms and
// *   convert between hyperbolid space and the Poincare disk
// *************************************************************************

var Point = function () {
  function Point(x, y) {
    var z = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    babelHelpers.classCallCheck(this, Point);

    this.x = x;
    this.y = y;
    this.z = z;
  }

  //compare two points taking rounding errors into account


  Point.prototype.compare = function compare(otherPoint) {
    if (typeof otherPoint === 'undefined') {
      console.warn('Compare Points: point not defined.');
      return false;
    }
    var a = toFixed(this.x) === toFixed(otherPoint.x);
    var b = toFixed(this.y) === toFixed(otherPoint.y);
    var c = toFixed(this.z) === toFixed(otherPoint.z);
    if (a && b && c) return true;
    return false;
  };

  //move the point to hyperboloid (Weierstrass) space, apply the transform,
  //then move back


  Point.prototype.transform = function transform(_transform) {
    var mat = _transform.matrix;
    var p = this.poincareToHyperboloid();
    var x = p.x * mat[0][0] + p.y * mat[0][1] + p.z * mat[0][2];
    var y = p.x * mat[1][0] + p.y * mat[1][1] + p.z * mat[1][2];
    var z = p.x * mat[2][0] + p.y * mat[2][1] + p.z * mat[2][2];
    var q = new Point(x, y, z);
    return q.hyperboloidToPoincare();
  };

  Point.prototype.poincareToHyperboloid = function poincareToHyperboloid() {
    var factor = 1 / (1 - this.x * this.x - this.y * this.y);
    var x = 2 * factor * this.x;
    var y = 2 * factor * this.y;
    var z = factor * (1 + this.x * this.x + this.y * this.y);
    var p = new Point(x, y);
    p.z = z;
    return p;
  };

  Point.prototype.hyperboloidToPoincare = function hyperboloidToPoincare() {
    var factor = 1 / (1 + this.z);
    var x = factor * this.x;
    var y = factor * this.y;
    return new Point(x, y);
  };

  Point.prototype.clone = function clone() {
    return new Point(this.x, this.y);
  };

  return Point;
}();

// * ***********************************************************************
// *
// *   MATH FUNCTIONS
// *
// *************************************************************************

//.toFixed returns a string for some no doubt very good reason.
//apply to fixed with default value of 10 and return as a float
var toFixed = function (number) {
  var places = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];
  return parseFloat(number.toFixed(places));
};

// * ***********************************************************************
// *
// *  DRAWING CLASS
// *
// *  All operations involved in drawing to the screen occur here.
// *  All objects are assumed to be on the unit Disk when passed here and
// *  are converted to screen space (which involves multiplying
// *  by the radius ~ half screen resolution)
// *************************************************************************

var Drawing = function () {
  function Drawing(radius) {
    babelHelpers.classCallCheck(this, Drawing);

    this.init();
  }

  Drawing.prototype.init = function init() {
    this.scene = new THREE.Scene();
    this.initCamera();
    this.initRenderer();
  };

  Drawing.prototype.reset = function reset() {
    this.clearScene();
    this.pattern = null; //reset materials;
    this.setCamera();
    this.setRenderer();
  };

  Drawing.prototype.clearScene = function clearScene() {
    for (var i = this.scene.children.length - 1; i >= 0; i--) {
      var object = this.scene.children[i];
      if (object.type === 'Mesh') {
        object.geometry.dispose();
        object.material.dispose();
        this.scene.remove(object);
      }
    }
  };

  Drawing.prototype.initCamera = function initCamera() {
    this.camera = new THREE.OrthographicCamera();
    this.setCamera();
    this.scene.add(this.camera);
  };

  Drawing.prototype.setCamera = function setCamera() {
    this.camera.left = -window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = -window.innerHeight / 2;
    this.camera.near = -2;
    this.camera.far = 1;
    this.camera.frustumCulled = false;
    this.camera.updateProjectionMatrix();
  };

  Drawing.prototype.initRenderer = function initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.setRenderer();
  };

  Drawing.prototype.setRenderer = function setRenderer() {
    this.renderer.setClearColor(0xffffff, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  Drawing.prototype.disk = function disk(centre, radius, color) {
    if (color === undefined) color = 0xffffff;
    var geometry = new THREE.CircleGeometry(radius * this.radius, 100, 0, 2 * Math.PI);
    var material = new THREE.MeshBasicMaterial({ color: color });

    var circle = new THREE.Mesh(geometry, material);
    circle.position.x = centre.x * this.radius;
    circle.position.y = centre.y * this.radius;

    this.scene.add(circle);
  };

  //TODO: passing elem param through lots of function to eventually get to renderToImageElem
  // which is called after final texture has loaded. There must be a better way!


  Drawing.prototype.polygonArray = function polygonArray(array, textureArray, color, wireframe, elem) {
    color = color || 0xffffff;
    wireframe = wireframe || false;
    for (var i = 0; i < array.length; i++) {
      this.polygon(array[i], color, textureArray, wireframe, elem);
    }
  };

  //Note: polygons assumed to be triangular


  Drawing.prototype.polygon = function polygon(_polygon, color, textures, wireframe, elem) {
    var divisions = _polygon.numDivisions || 1;
    var p = 1 / divisions;
    var geometry = new THREE.Geometry();
    geometry.faceVertexUvs[0] = [];

    if (_polygon.needsResizing) {
      for (var i = 0; i < _polygon.mesh.length; i++) {
        geometry.vertices.push(new Point(_polygon.mesh[i].x * this.radius, _polygon.mesh[i].y * this.radius));
      }
    } else {
      geometry.vertices = _polygon.mesh;
    }

    var edgeStartingVertex = 0;
    //loop over each interior edge of the polygon's subdivion mesh
    for (var _i = 0; _i < divisions; _i++) {
      //edge divisions reduce by one for each interior edge
      var m = divisions - _i + 1;
      geometry.faces.push(new THREE.Face3(edgeStartingVertex, edgeStartingVertex + m, edgeStartingVertex + 1));
      geometry.faceVertexUvs[0].push([new Point(_i * p, 0), new Point((_i + 1) * p, 0), new Point((_i + 1) * p, p)]);

      //range m-2 because we are ignoring the edges first vertex which was
      //used in the previous faces.push
      for (var j = 0; j < m - 2; j++) {
        geometry.faces.push(new THREE.Face3(edgeStartingVertex + j + 1, edgeStartingVertex + m + j, edgeStartingVertex + m + 1 + j));
        geometry.faceVertexUvs[0].push([new Point((_i + 1 + j) * p, (1 + j) * p), new Point((_i + 1 + j) * p, j * p), new Point((_i + j + 2) * p, (j + 1) * p)]);
        geometry.faces.push(new THREE.Face3(edgeStartingVertex + j + 1, edgeStartingVertex + m + 1 + j, edgeStartingVertex + j + 2));
        geometry.faceVertexUvs[0].push([new Point((_i + 1 + j) * p, (1 + j) * p), new Point((_i + 2 + j) * p, (j + 1) * p), new Point((_i + j + 2) * p, (j + 2) * p)]);
      }
      edgeStartingVertex += m;
    }
    var mesh = this.createMesh(geometry, color, textures, _polygon.materialIndex, wireframe, elem);
    this.scene.add(mesh);
  };

  //NOTE: some polygons are inverted due to vertex order,
  //solved this by making material doubles sided


  Drawing.prototype.createMesh = function createMesh(geometry, color, textures, materialIndex, wireframe, elem) {
    if (wireframe === undefined) wireframe = false;
    if (color === undefined) color = 0xffffff;

    if (!this.pattern) {
      this.createPattern(color, textures, wireframe, elem);
    }
    return new THREE.Mesh(geometry, this.pattern.materials[materialIndex]);
  };

  Drawing.prototype.createPattern = function createPattern(color, textures, wireframe, elem) {
    var _this = this;

    this.pattern = new THREE.MultiMaterial();
    var texturesLoaded = [];

    var _loop = function (i) {
      var material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe,
        side: THREE.DoubleSide
      });

      var texture = new THREE.TextureLoader().load(textures[i], function () {
        texturesLoaded.push(i);
        //call render when all textures are loaded
        if (texturesLoaded.length === textures.length) {
          _this.renderToImageElem(elem);
        }
      });

      material.map = texture;
      _this.pattern.materials.push(material);
    };

    for (var i = 0; i < textures.length; i++) {
      _loop(i);
    }
  };

  //render to image elem


  Drawing.prototype.renderToImageElem = function renderToImageElem(elem) {
    this.renderer.render(this.scene, this.camera);
    this.appendImageToDom(elem);
    this.clearScene();
  };

  Drawing.prototype.appendImageToDom = function appendImageToDom(elem) {
    document.querySelector(elem).setAttribute('src', this.renderer.domElement.toDataURL());
  };

  //Download the canvas as a png image


  Drawing.prototype.downloadImage = function downloadImage() {
    var link = document.querySelector('#download-image');
    link.href = this.renderer.domElement.toDataURL();
    link.download = 'hyperbolic-tiling.png';
  };

  //convert the canvas to a base64URL and send to saveImage.php


  Drawing.prototype.saveImage = function saveImage() {
    var data = this.renderer.domElement.toDataURL();
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'saveImage.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send('img=' + data);
  };

  babelHelpers.createClass(Drawing, [{
    key: 'radius',
    set: function (newRadius) {
      this._radius = newRadius;
    },
    get: function () {
      return this._radius;
    }
  }]);
  return Drawing;
}();

/* layout.js */

// * ***********************************************************************
// *
// *  LAYOUT CONTROLLER CLASS
// *
// *  controls position/loading/hiding etc.
// *************************************************************************
var LayoutController = function () {
  function LayoutController() {
    babelHelpers.classCallCheck(this, LayoutController);

    this.topPanel = new TopPanel();
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

// * ***********************************************************************
// *
// *  CONTROLLER CLASS
// *
// *************************************************************************
var Controller = function () {
  function Controller() {
    babelHelpers.classCallCheck(this, Controller);

    this.layout = new LayoutController();
    this.draw = new Drawing();
  }

  Controller.prototype.onResize = function onResize() {};

  Controller.prototype.saveImageButtons = function saveImageButtons() {
    var _this = this;

    document.querySelector('#save-image').onclick = function () {
      return _this.draw.saveImage();
    };
    document.querySelector('#download-image').onclick = function () {
      return _this.draw.downloadImage();
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