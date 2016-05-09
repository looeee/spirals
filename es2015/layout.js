// * ***********************************************************************
// *
// *  LAYOUT CONTROLLER CLASS
// *
// *  controls position/loading/hiding etc.
// *************************************************************************
export class LayoutController {
  constructor() {
    this.topPanel = new TopPanel();
    this.setupLayout();
  }

  setupLayout() {

  }

  onResize() {

  }

  bottomPanel() {

  }

  hideElements(...elements) {
    for (const element of elements) {
      document.querySelector(element).classList.add('hide');
    }
  }

  showElements(...elements) {
    for (const element of elements) {
      document.querySelector(element).classList.remove('hide');
    }
  }


}
