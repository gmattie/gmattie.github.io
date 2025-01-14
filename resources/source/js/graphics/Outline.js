//Imports
import * as C from "../support/constants.js";

/**
 * @description The <strong>Outline</strong> class produces a visual placeholder for a pre-loading <strong>Picture</strong> object.
 * @class
 * @requires constants
 *
 */
class Outline {
  /**
   * @param {number} nativeWidth - The maximum width of the HTMLCanvasElement.
   * @param {number} nativeHeight - The maximum height of the HTMLCanvasElement.
   * @param {string} grayChannel - A string representation of an 8-bit hexadecimal number.
   *
   */
  constructor(nativeWidth, nativeHeight, grayChannel) {
    this._nativeWidth = nativeWidth;
    this._nativeHeight = nativeHeight;
    this._grayChannel = grayChannel;

    this._init();
  }

  /**
   * @description Initializes the HTMLCanvasElement and its CanvasRenderingContext2D.
   * @private
   * @function
   *
   */
  _init() {
    this._canvas = document.createElement(C.HTML.CANVAS);

    const canvas = this._canvas;
    canvas.id = C.CSSID.MAGNIFIED_IMAGE_OUTLINE;
    canvas.width = this._nativeWidth + Math.ceil(C.Line.TRANSLATION);
    canvas.height = this._nativeHeight + Math.ceil(C.Line.TRANSLATION);

    this._context = canvas.getContext(C.HTML.CANVAS_RENDERING_CONTEXT_2D);

    const context = this._context;
    context.lineWidth = C.Line.WIDTH;
    context.translate(C.Line.TRANSLATION, C.Line.TRANSLATION);
  }

  /**
   * @description Draws or redraws the CanvasRenderingContext2D object.
   * @param {number} width - The width to draw according to the responsive width of the <strong>Picture</strong> parent.
   * @param {number} height - The height to draw according to the responsive height of the <strong>Picture</strong> parent.
   * @public
   * @function
   *
   */
  draw(width, height) {
    width = Math.min(width, this._nativeWidth) - C.Line.WIDTH;
    height = Math.min(height, this._nativeHeight) - C.Line.WIDTH;

    const context = this._context;
    context.clearRect(
      -C.Line.TRANSLATION,
      -C.Line.TRANSLATION,
      context.canvas.width,
      context.canvas.height,
    );
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.lineTo(0, 0);

    const gradient = context.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(
      "0",
      `rgba(${this._grayChannel}, ${this._grayChannel}, ${this._grayChannel}, 0)`,
    );
    gradient.addColorStop(
      "1",
      `rgba(${this._grayChannel}, ${this._grayChannel}, ${this._grayChannel}, 255)`,
    );

    context.strokeStyle = gradient;
    context.stroke();
  }

  /**
   * @description Prepares the instance for safe nullification by releasing allocated internal objects for garbage collection.
   * @public
   * @function
   *
   */
  dispose() {
    this._canvas = null;
  }

  /**
   * @description Gets the HTMLCanvasElement.
   * @type {Object}
   * @readonly
   *
   */
  get element() {
    return this._canvas;
  }
}

/**
 * @description ImagePreloadOutline class module
 * @module
 *
 */
export default Outline;
