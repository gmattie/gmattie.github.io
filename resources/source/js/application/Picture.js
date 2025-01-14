//Imports
import * as C from "../support/constants.js";
import Book from "../graphics/Book.js";
import Loader from "../support/Loader.js";
import Loupe from "./Loupe.js";
import Outline from "../graphics/Outline.js";

/**
 * @description The <strong>Picture</strong> class instantiates an image that features visual pre-loading, responsive resizing and conditional zoom functionality.
 * @class
 * @requires constants
 * @requires Book
 * @requires Loader
 * @requires Loupe
 * @requires Outline
 *
 */
class Picture {
  /**
   * @param {string} url - The file path of the image content.
   * @param {number} nativeWidth - The width of the image content.
   * @param {number} nativeHeight - The height of the image content.
   * @param {boolean} isZoomable - A flag that determines zoomability.
   *
   */
  constructor(url, nativeWidth, nativeHeight, isZoomable) {
    this._url = url;
    this._nativeWidth = nativeWidth;
    this._nativeHeight = nativeHeight;
    this._isZoomable = isZoomable;

    this._init();
  }

  /**
   * @description Instantiates and populates the HTMLDivElement container.
   * @private
   * @function
   *
   */
  _init() {
    this._element = document.createElement(C.HTML.DIV);

    const element = this._element;
    element.classList.add(C.CSSClass.PICTURE);
    element.style.lineHeight = 0;

    if (this._isZoomable) {
      this._loupe = new Loupe();

      element.appendChild(this._loupe.element);
    }

    this._isLoading = false;
    this._isLoaded = false;

    this._fadeOutAnimationHandler = this._fadeOutAnimationHandler.bind(this);
    this._fadeInAnimationHandler = this._fadeInAnimationHandler.bind(this);

    this._outline = new Outline(
      this._nativeWidth,
      this._nativeHeight,
      C.Color.GRAY_CHANNEL,
    );

    const grayChannel = C.Color.GRAY_CHANNEL;
    const grayColor = `rgb(${grayChannel}, ${grayChannel}, ${grayChannel})`;

    this._book = new Book(C.Book.SCALE, grayColor);
    this._book.element.classList.add(C.CSSAnimation.IMAGE_PRELOADER);

    this._element.appendChild(this._outline.element);
    this._element.appendChild(this._book.element);

    this._contentLoader = new Loader(this._url, Loader.ResponseType.BLOB);
    this._contentLoader.addListener(
      Loader.Event.PROGRESS,
      this._contentLoaderProgressHandler.bind(this),
    );
    this._contentLoader.addListener(
      Loader.Event.COMPLETE,
      this._contentLoaderCompleteHandler.bind(this),
    );
  }

  /**
   * @description The content progress event callback function.
   * @param {Object} data - An object containing <em>"loaded"</em> and <em>"total"</em> properties.
   * @private
   * @function
   *
   */
  _contentLoaderProgressHandler(data) {
    const yPos = (this._imageLoadProgressHeight / data.total) * data.loaded;

    this._book.element.style.top = `${yPos}${C.CSS.PX}`;
  }

  /**
   * @description The content complete event callback function.
   * @param {Object} data - An object containing <em>"target"</em> and <em>"response"</em> properties.
   * @private
   * @function
   *
   */
  _contentLoaderCompleteHandler(data) {
    const blobURL = URL.createObjectURL(data.response);

    this._createContent(blobURL);

    C.HTMLElement.CONTENT.classList.add(C.CSSClass.SUSPEND_POINTER_EVENTS);

    this._element.addEventListener(
      C.Event.ANIMATION_END,
      this._fadeOutAnimationHandler,
    );
    this._element.classList.add(C.CSSAnimation.FADE_OUT);

    this._contentLoader.dispose();
    this._contentLoader = null;
  }

  /**
   * @description Initializes the image content with mouse and keyboard events to support zoomability.
   * @param {string} imageSource - The URL of the image content.
   * @private
   * @function
   *
   */
  _createContent(imageSource) {
    this._isLoaded = true;
    this._isLoading = false;

    this._content = document.createElement(C.HTML.IMG);

    const content = this._content;
    content.id = C.CSSID.CONTENT;
    content.src = imageSource;

    this._contextMenuHandler = this._contextMenuHandler.bind(this);
    this._dragStartHandler = this._dragStartHandler.bind(this);

    content.addEventListener(C.Event.CONTEXT_MENU, this._contextMenuHandler);
    content.addEventListener(C.Event.DRAG_START, this._dragStartHandler);

    if (this._isZoomable) {
      this._mouseEnterHandler = this._mouseEnterHandler.bind(this);
      this._mouseMoveHandler = this._mouseMoveHandler.bind(this);
      this._mouseLeaveHandler = this._mouseLeaveHandler.bind(this);
      this._mouseWheelHandler = this._mouseWheelHandler.bind(this);
      this._keyDownHandler = this._keyDownHandler.bind(this);

      content.addEventListener(C.Event.MOUSE_ENTER, this._mouseEnterHandler);
      content.addEventListener(C.Event.MOUSE_MOVE, this._mouseMoveHandler);
      content.addEventListener(C.Event.MOUSE_LEAVE, this._mouseLeaveHandler);
      content.addEventListener(C.Event.MOUSE_WHEEL, this._mouseWheelHandler);

      this._loupe.content = imageSource;
    }
  }

  /**
   * @description Mouse right-click callback function that prevents the context menu from appearing.
   * @param {Object} event - The mouse event object.
   * @private
   * @function
   *
   */
  _contextMenuHandler(event) {
    event.preventDefault();
  }

  /**
   * @description Mouse drag callback function that prevents drag and drop functionality.
   * @param {Object} event - The mouse event object.
   * @private
   * @function
   *
   */
  _dragStartHandler(event) {
    event.preventDefault();
  }

  /**
   * @description Mouse enter event callback function.
   * @private
   * @function
   *
   */
  _mouseEnterHandler() {
    document.addEventListener(C.Event.KEYDOWN, this._keyDownHandler);

    this._loupe.element.classList.remove(C.CSSAnimation.FADE_OUT);
    this._loupe.element.classList.add(C.CSSAnimation.FADE_IN);

    this._element.style.cursor = C.CSS.NONE;
  }

  /**
   * @description Mouse move event callback function that avoids using event.offsetX/offsetY for performance optimization.
   * @param {Object} event - The mouse event object.
   * @private
   * @function
   *
   */
  _mouseMoveHandler(event) {
    this._mouseX = event.clientX - this._imageOffsetX;
    this._mouseY = event.clientY - this._imageOffsetY;

    this._loupe.updatePosition(
      this._mouseX,
      this._mouseY,
      this._width,
      this._height,
    );
  }

  /**
   * @description Mouse leave event callback function.
   * @private
   * @function
   *
   */
  _mouseLeaveHandler() {
    document.removeEventListener(C.Event.KEYDOWN, this._keyDownHandler);

    this._loupe.element.classList.remove(C.CSSAnimation.FADE_IN);
    this._loupe.element.classList.add(C.CSSAnimation.FADE_OUT);

    this._element.style.cursor = C.CSS.AUTO;
  }

  /**
   * @description Mouse wheel event callback function.
   * @param {Object} event - The mouse event object.
   * @private
   * @function
   *
   */
  _mouseWheelHandler(event) {
    if (event.target) {
      event.preventDefault();
    }

    const zoomDirection =
      event.deltaY < 0
        ? Loupe.ZoomDirection.ZOOM_IN
        : Loupe.ZoomDirection.ZOOM_OUT;
    const accelerate = event.shiftKey;

    this._loupe.updateZoom(
      zoomDirection,
      this._mouseX,
      this._mouseY,
      this._width,
      this._height,
      accelerate,
    );
  }

  /**
   * @description Keyboard down event callback function.
   * @param {Object} event - The keyboard event object.
   * @private
   * @function
   *
   */
  _keyDownHandler(event) {
    event.preventDefault();

    let zoomDirection;

    switch (event.key) {
      case C.Key.ARROW_UP:
      case C.Key.UP:
      case C.Key.ARROW_RIGHT:
      case C.Key.RIGHT:
        zoomDirection = Loupe.ZoomDirection.ZOOM_IN;

        break;

      case C.Key.ARROW_DOWN:
      case C.Key.DOWN:
      case C.Key.ARROW_LEFT:
      case C.Key.LEFT:
        zoomDirection = Loupe.ZoomDirection.ZOOM_OUT;

        break;

      default:
        return;
    }

    /*
     * The zoomDirection that populates a simulated mouse wheel event deltaY
     * property must be negated in order to facilitate compatibility.
     *
     */

    this._mouseWheelHandler({
      deltaY: zoomDirection * -1,
      shiftKey: event.shiftKey,
    });
  }

  /**
   * @description Fade out CSS animation callback function.
   * @param {Object} event - The CSS animation event object.
   * @private
   * @function
   *
   */
  _fadeOutAnimationHandler(event) {
    const element = event.target;
    element.removeEventListener(
      C.Event.ANIMATION_END,
      this._fadeOutAnimationHandler,
    );
    element.classList.remove(C.CSSAnimation.FADE_OUT);

    element.removeChild(this._outline.element);
    this._outline.dispose();
    this._outline = null;

    element.removeChild(this._book.element);
    this._book.dispose();
    this._book = null;

    element.appendChild(this._content);

    element.addEventListener(
      C.Event.ANIMATION_END,
      this._fadeInAnimationHandler,
    );
    element.classList.add(C.CSSAnimation.FADE_IN);
  }

  /**
   * @description Fade in CSS animation callback function.
   * @param {Object} event - The CSS animation event object.
   * @private
   * @function
   *
   */
  _fadeInAnimationHandler(event) {
    const element = event.target;
    element.removeEventListener(
      C.Event.ANIMATION_END,
      this._fadeInAnimationHandler,
    );
    element.classList.remove(C.CSSAnimation.FADE_IN);

    C.HTMLElement.CONTENT.classList.remove(C.CSSClass.SUSPEND_POINTER_EVENTS);
  }

  /**
   * @description Initializes loading of the image content.
   * @public
   * @function
   *
   */
  load() {
    if (!this._isLoaded) {
      this._isLoading = true;

      this._contentLoader.load();
    }
  }

  /**
   * @description Handles responsive resizing of the image content or pre-loading graphics and sets a minimum zoom value.
   * @param {number} maxWidth - The maximum width available for proportionate resizing of the image content.
   * @param {number} maxHeight - The maximum height available for proportionate resizing of the image content.
   * @param {number} minWidth - The minimum width of the resizable image content.
   * @param {number} offsetX - The horizontal distance from top-left of the viewport to top-left of the image content.
   * @param {number} offsetY - The vertical distance from top-left of the viewport to top-left of the image content.
   * @public
   * @function
   *
   */
  resize(maxWidth, maxHeight, minWidth, offsetX, offsetY) {
    const nativeWidth = this._nativeWidth;
    const nativeHeight = this._nativeHeight;

    let ratio;

    if (maxWidth < nativeWidth || maxHeight < nativeHeight) {
      const ratioWidth = maxWidth / nativeWidth;
      const ratioHeight = maxHeight / nativeHeight;

      ratio = Math.max(
        minWidth / nativeWidth,
        Math.min(ratioWidth, ratioHeight),
      );

      this._width = Math.floor(nativeWidth * ratio);
      this._height = Math.floor(nativeHeight * ratio);
    } else {
      this._width = nativeWidth;
      this._height = nativeHeight;

      ratio = 1.0;
    }

    this._element.style.width = `${this._width}${C.CSS.PX}`;
    this._element.style.height = `${this._height}${C.CSS.PX}`;

    this._imageOffsetX = Math.round(offsetX);
    this._imageOffsetY = Math.round(offsetY);

    if (this._isZoomable) {
      this._loupe.minimumZoom = ratio;
    }

    if (!this._isLoaded) {
      this._outline.draw(this._width, this._height);
      this._imageLoadProgressHeight =
        this._height - this._book.element.offsetHeight;
    }
  }

  /**
   * @description Prepares the instance for safe nullification by releasing allocated internal objects for garbage collection.
   * @public
   * @function
   *
   */
  dispose() {
    while (this._element.firstChild) {
      this._element.removeChild(this._element.firstChild);
    }

    this._element.removeEventListener(
      C.Event.ANIMATION_END,
      this._fadeOutAnimationHandler,
    );
    this._element.removeEventListener(
      C.Event.ANIMATION_END,
      this._fadeInAnimationHandler,
    );
    this._element = null;

    if (this._contentLoader) {
      this._contentLoader.dispose();
      this._contentLoader = null;
    }

    if (this._content) {
      URL.revokeObjectURL(this._content.src);

      this._content.removeEventListener(
        C.Event.CONTEXT_MENU,
        this._contextMenuHandler,
      );
      this._content.removeEventListener(
        C.Event.DRAG_START,
        this._dragStartHandler,
      );

      if (this._isZoomable) {
        this._content.removeEventListener(
          C.Event.MOUSE_ENTER,
          this._mouseEnterHandler,
        );
        this._content.removeEventListener(
          C.Event.MOUSE_MOVE,
          this._mouseMoveHandler,
        );
        this._content.removeEventListener(
          C.Event.MOUSE_LEAVE,
          this._mouseLeaveHandler,
        );
        this._content.removeEventListener(
          C.Event.MOUSE_WHEEL,
          this._mouseWheelHandler,
        );

        document.removeEventListener(C.Event.KEYDOWN, this._keyDownHandler);
      }

      this._content = null;
    }

    if (this._outline) {
      this._outline.dispose();
      this._outline = null;
    }

    if (this._book) {
      this._book.dispose();
      this._book = null;
    }

    if (this._loupe) {
      this._loupe.dispose();
      this._loupe = null;
    }
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
   * @description Gets the loading state of the image.
   * @type {boolean}
   * @readonly
   *
   */
  get isLoading() {
    return this._isLoading;
  }

  /**
   * @description Gets the loaded state of the image.
   * @type {boolean}
   * @readonly
   *
   */
  get isLoaded() {
    return this._isLoaded;
  }

  /**
   * @description Gets the zoomable state of the image.
   * @type {boolean}
   * @readonly
   *
   */
  get isZoomable() {
    return this._isZoomable;
  }
}

/**
 * @description Picture class module
 * @module
 *
 */
export default Picture;
