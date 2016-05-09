/* controller.js */

import {
  Drawing,
}
from './drawing';
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
    this.draw = new Drawing();
  }

  onResize() {
  }

  saveImageButtons() {
    document.querySelector('#save-image').onclick = () => this.draw.saveImage();
    document.querySelector('#download-image').onclick = () => this.draw.downloadImage();
  }
}
