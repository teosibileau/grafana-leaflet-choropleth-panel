// Jest setup provided by Grafana scaffolding
import './.config/jest-setup';

// The scaffolded getContext mock returns an empty object.
// Grafana's Combobox uses canvas measureText for sizing, so we need a fuller stub.
HTMLCanvasElement.prototype.getContext = function () {
  return {
    measureText: (text) => ({ width: text.length * 8 }),
    fillText: () => {},
    clearRect: () => {},
    fillRect: () => {},
    getImageData: () => ({ data: [] }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    canvas: this,
  };
};
