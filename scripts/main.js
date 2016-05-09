var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers;

//import * as E from './universal/mathFunctions';
//import { Point } from './universal/universalElements';
// * ***********************************************************************
// *
// *  RENDERER CLASS
// *
// *  All operations involved in drawing to the screen occur here.
// *************************************************************************
var Renderer = function () {
  function Renderer(renderElem) {
    babelHelpers.classCallCheck(this, Renderer);

    this.scene = new THREE.Scene();
    this.initCamera();
    this.initRenderer(renderElem);
  }

  Renderer.prototype.reset = function reset() {
    this.clearScene();
    this.pattern = null; //reset materials;
    this.setCamera();
    this.setRenderer();
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

  Renderer.prototype.disk = function disk(centre, radius, color) {
    if (color === undefined) color = 0xffffff;
    var geometry = new THREE.CircleGeometry(radius * this.radius, 100, 0, 2 * Math.PI);
    var material = new THREE.MeshBasicMaterial({ color: color });

    var circle = new THREE.Mesh(geometry, material);
    circle.position.x = centre.x;
    circle.position.y = centre.y;

    this.scene.add(circle);
  };

  //NOTE: some polygons are inverted due to vertex order,
  //solved this by making material doubles sided


  Renderer.prototype.createMesh = function createMesh(geometry, color, textures, materialIndex, wireframe, elem) {
    if (wireframe === undefined) wireframe = false;
    if (color === undefined) color = 0xffffff;

    if (!this.pattern) {
      this.createPattern(color, textures, wireframe, elem);
    }
    return new THREE.Mesh(geometry, this.pattern.materials[materialIndex]);
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

  Renderer.prototype.render = function render() {
    var _this = this;

    window.requestAnimationFrame(function () {
      return _this.render();
    });
    this.renderer.render(this.scene, this.camera);
  };

  return Renderer;
}();

/* UNUSED FUNCTIONS


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
    this.init();
  }

  Controller.prototype.init = function init() {
    this.renderer.render();
  };

  Controller.prototype.onResize = function onResize() {};

  //to use this add buttons with the classes below


  Controller.prototype.saveImageButtons = function saveImageButtons() {
    var _this = this;

    document.querySelector('#save-image').onclick = function () {
      return _this.render.saveImage();
    };
    document.querySelector('#download-image').onclick = function () {
      return _this.render.downloadImage();
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