//Imports
import * as C from "../support/constants.js";
import * as Utils from "../support/utils.js";
import Loader from "../support/Loader.js";

/**
 * @description The <strong>Loupe</strong> class instantiates a multi-layer component used to facilitate zooming of its parent <strong>Picture</strong> object.
 * @class
 * @requires constants
 * @requires utils
 * @requires Loader
 *
 */
class Loupe {
  constructor() {
    this._init();
  }

  /**
   * @description Instantiates and populates the HTMLDivElement container.
   * @private
   * @function
   *
   */
  _init() {
    this._background = document.createElement(C.HTML.DIV);
    this._background.id = C.CSSID.BACKGROUND;

    this._content = document.createElement(C.HTML.IMG);
    this._content.id = C.CSSID.CONTENT;

    this._mask = document.createElement(C.HTML.DIV);
    this._mask.id = C.CSSID.MASK;
    this._mask.appendChild(this._content);

    this._skin = document.createElement(C.HTML.IMG);
    this._skin.id = C.CSSID.SKIN;

    this._zoom = document.createElement(C.HTML.DIV);
    this._zoom.id = C.CSSID.ZOOM;

    this._element = document.createElement(C.HTML.DIV);

    const element = this._element;
    element.classList.add(C.CSSClass.LOUPE);
    element.appendChild(this._background);
    element.appendChild(this._mask);
    element.appendChild(this._skin);
    element.appendChild(this._zoom);

    this._skinLoader = new Loader(C.Assets.LOUPE_URL, Loader.ResponseType.BLOB);
    this._skinLoader.addListener(
      Loader.Event.COMPLETE,
      this._skinLoaderCompleteHandler.bind(this),
    );
    this._skinLoader.load();
  }

  /**
   * @description Skin image loading complete event callback function.
   * @param {Object} data - An object containing <em>"target"</em> and <em>"response"</em> properties.
   * @private
   * @function
   *
   */
  _skinLoaderCompleteHandler(data) {
    const blobURL = URL.createObjectURL(data.response);

    this._skin.src = blobURL;

    this._skinLoader.dispose();
    this._skinLoader = null;
  }

  /**
   * @description Restores both the zoom level and zoom label from a previous <strong>Loupe</strong> instance.
   * @private
   * @function
   *
   */
  _restoreZoom() {
    const cachedZoomLevel = sessionStorage.getItem(C.CSSID.ZOOM);

    this._zoomLevel = cachedZoomLevel
      ? Math.max(this._minimumZoom, cachedZoomLevel)
      : Math.max(this._minimumZoom, C.Loupe.ZOOM_DEFAULT);
    this.updateZoom();

    this._isZoomRestored = true;
  }

  /**
   * @description Updates both the zoom level and zoom label.
   * @param {number} [direction = null] - The direction in which to zoom (Loupe.ZoomDirection.ZOOM_IN or Loupe.ZoomDirection.ZOOM_OUT).
   * @param {number} [x = null] - The x coordinate of the <strong>Picture</strong> object from which to zoom.
   * @param {number} [y = null] - The y coordinate of the <strong>Picture</strong> object from which to zoom.
   * @param {number} [width = null] - The width of the <strong>Picture</strong> object.
   * @param {number} [height = null] - The height of the <strong>Picture</strong> object.
   * @param {boolean} [accelerate = null] - A flag that determines the speed/distance in which to zoom.
   * @public
   * @function
   *
   */
  updateZoom(
    direction = null,
    x = null,
    y = null,
    width = null,
    height = null,
    accelerate = false,
  ) {
    if (direction) {
      const zoomIn = accelerate
        ? C.Loupe.ZOOM_STEP_ACCELERATED
        : C.Loupe.ZOOM_STEP;
      const zoomOut = -zoomIn;
      const zoomStep =
        direction === Loupe.ZoomDirection.ZOOM_IN ? zoomIn : zoomOut;

      this._zoomLevel = Math.min(
        Math.max(this._minimumZoom, (this._zoomLevel += zoomStep)),
        C.Loupe.ZOOM_MAX,
      );

      this.updatePosition(x, y, width, height);
    }

    this._zoom.textContent = this._zoomLevel.toFixed(2);
  }

  /**
   * @description Updates the position of the image content in relation to its position over the parent <strong>Picture</strong> object.
   * @param {number} x - The x coordinate of the <strong>Picture</strong> object from which to zoom.
   * @param {number} y - The y coordinate of the <strong>Picture</strong> object from which to zoom.
   * @param {number} width - The width of the <strong>Picture</strong> object.
   * @param {number} height - The height of the <strong>Picture</strong> object.
   * @public
   * @function
   *
   */
  updatePosition(x, y, width, height) {
    if (!this._skinHalfSize) {
      this._skinHalfSize = this._skin.clientWidth / 2;
    }

    if (!this._maskOffset) {
      this._maskOffset = Utils.elementTransformMatrix(this._mask);
    }

    const fractionX = x / width;
    const fractionY = y / height;

    const contentX =
      -(this._content.clientWidth * this._zoomLevel * fractionX) /
        this._zoomLevel -
      this._maskOffset.tx / this._zoomLevel +
      this._skinHalfSize / this._zoomLevel;
    const contentY =
      -(this._content.clientHeight * this._zoomLevel * fractionY) /
        this._zoomLevel -
      this._maskOffset.ty / this._zoomLevel +
      this._skinHalfSize / this._zoomLevel;

    this._element.style.transform = `${C.CSS.TRANSLATE}(${
      x - this._skinHalfSize
    }${C.CSS.PX}, ${y - this._skinHalfSize}${C.CSS.PX})`;
    this._content.style.transform = `${C.CSS.SCALE}(${this._zoomLevel}) ${C.CSS.TRANSLATE}(${contentX}${C.CSS.PX}, ${contentY}${C.CSS.PX})`;
  }

  /**
   * @description Prepares the instance for safe nullification by releasing allocated internal objects for garbage collection.
   * @public
   * @function
   *
   */
  dispose() {
    try {
      sessionStorage.setItem(C.CSSID.ZOOM, this._zoomLevel);
    } catch (error) {
      console.error(error);
    }

    while (this._element.firstChild) {
      this._element.removeChild(this._element.firstChild);
    }

    this._element = null;

    if (this._skinLoader) {
      this._skinLoader.dispose();
      this._skinLoader = null;
    }

    if (this._skin) {
      URL.revokeObjectURL(this._skin.src);

      this._skin = null;
    }

    this._background = null;
    this._content = null;
    this._mask = null;
    this._zoom = null;
    this._maskOffset = null;
  }

  /**
   * @description Gets the HTMLDivElement container.
   * @type {Object}
   * @readonly
   *
   */
  get element() {
    return this._element;
  }

  /**
   * @description Sets the File path of the image content.
   * @type {string}
   * @readonly
   *
   */
  set content(value) {
    this._content.src = value;

    if (this._minimumZoom) {
      this._restoreZoom();
    }
  }

  /**
   * @description Sets the minimum zoom level of the image content.
   * @type {number}
   * @readonly
   *
   */

  set minimumZoom(value) {
    this._minimumZoom = value;

    if (this._content.src && !this._isZoomRestored) {
      this._restoreZoom();
    } else {
      if (this._zoomLevel < this._minimumZoom) {
        this._zoomLevel = this._minimumZoom;

        this.updateZoom();
      }
    }
  }

  /**
   * @description Properties of type <strong>{number}</strong> consist of:
   * <ul>
   *     <li> ZOOM_IN </li>
   *     <li> ZOOM_OUT </li>
   * </ul>
   *
   * @static
   * @constant
   *
   */
  static get ZoomDirection() {
    return {
      ZOOM_IN: 1,
      ZOOM_OUT: -1,
    };
  }
}

/**
 * @description Loupe class module
 * @module
 *
 */
export default Loupe;
