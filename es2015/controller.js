import {
  Renderer,
}
from './renderer';
import {
  LayoutController as Layout,
}
from './layout';

// * ***********************************************************************
// *
// *  CONTROLLER CLASS
// *
// *************************************************************************
export class Controller {
  constructor() {
    this.layout = new Layout();
    this.renderer = new Renderer(
      //document.querySelector('#canvas') //NOT WORKING!!
    );
    this.init();
  }

  init() {
    this.renderer.render();
  }

  onResize() {
  }

  //to use this add buttons with the classes below
  saveImageButtons() {
    document.querySelector('#save-image').onclick = () => this.render.saveImage();
    document.querySelector('#download-image').onclick = () => this.render.downloadImage();
  }
}
