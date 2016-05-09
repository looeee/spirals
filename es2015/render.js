import * as E from './universal/mathFunctions';
import { Point } from './universal/universalElements';
// * ***********************************************************************
// *
// *  DRAWING CLASS
// *
// *  All operations involved in drawing to the screen occur here.
// *************************************************************************
export class Render {
  constructor() {
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.initCamera();
    this.initRenderer();
  }

  reset() {
    this.clearScene();
    this.pattern = null; //reset materials;
    this.setCamera();
    this.setRenderer();
  }

  clearScene() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const object = this.scene.children[i];
      if (object.type === 'Mesh') {
        object.geometry.dispose();
        object.material.dispose();
        this.scene.remove(object);
      }
    }
  }

  initCamera() {
    this.camera = new THREE.OrthographicCamera();
    this.setCamera();
    this.scene.add(this.camera);
  }

  setCamera() {
    this.camera.left = -window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = -window.innerHeight / 2;
    this.camera.near = -2;
    this.camera.far = 1;
    this.camera.frustumCulled = false;
    this.camera.updateProjectionMatrix();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.setRenderer();
  }

  setRenderer() {
    this.renderer.setClearColor(0xffffff, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  disk(centre, radius, color) {
    if (color === undefined) color = 0xffffff;
    const geometry = new THREE.CircleGeometry(radius * this.radius, 100, 0, 2 * Math.PI);
    const material = new THREE.MeshBasicMaterial({ color });

    const circle = new THREE.Mesh(geometry, material);
    circle.position.x = centre.x;
    circle.position.y = centre.y;

    this.scene.add(circle);
  }

  //NOTE: some polygons are inverted due to vertex order,
  //solved this by making material doubles sided
  createMesh(geometry, color, textures, materialIndex, wireframe, elem) {
    if (wireframe === undefined) wireframe = false;
    if (color === undefined) color = 0xffffff;

    if (!this.pattern) {
      this.createPattern(color, textures, wireframe, elem);
    }
    return new THREE.Mesh(geometry, this.pattern.materials[materialIndex]);
  }

  //render to image elem
  renderToImageElem(elem) {
    this.renderer.render(this.scene, this.camera);
    this.appendImageToDom(elem);
    this.clearScene();
  }

  appendImageToDom(elem) {
    document.querySelector(elem).setAttribute('src', this.renderer.domElement.toDataURL());
  }

  //Download the canvas as a png image
  downloadImage() {
    const link = document.querySelector('#download-image');
    link.href = this.renderer.domElement.toDataURL();
    link.download = 'hyperbolic-tiling.png';
  }

  //convert the canvas to a base64URL and send to saveImage.php
  saveImage() {
    const data = this.renderer.domElement.toDataURL();
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'saveImage.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`img=${data}`);
  }

  addBoundingBoxHelper(mesh) {
    const box = new THREE.BoxHelper(mesh);
    //box.update();
    this.scene.add(box);
  }

}

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
