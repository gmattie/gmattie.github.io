//Imports
import * as C from "../support/constants.js";
import Dispatcher from "../support/Dispatcher.js";

/**
 * @description The <strong>TextField</strong> class creates instances of either clickable and animatable text or static text.
 * @class
 * @requires constants
 * @requires Dispatcher
 *
 */
class TextField extends Dispatcher {
  /**
   * @param {string} label - The textual content of the HTMLDivElement or HTMLAnchorElement.
   * @param {string} id - DOMString representing the ID of the HTMLDivElement or HTMLAnchorElement.
   * @param {string} href - The hypertext reference assigned to the HTMLAnchorElement.
   * @param {string} download - Instructs browsers to download a URL instead of navigating to it.
   * @param {string} footnote - A flag that determines if the HTMLDivElement will be styled as a footnote.
   *
   */
  constructor(label, id, href, download, footnote) {
    super();

    this._label = label;
    this._id = id;
    this._href = href;
    this._download = download;
    this._footnote = footnote;

    this._init();
  }

  /**
   * @description Instantiates either an HTMLDivElement or HTMLAnchorElement.
   * @private
   * @function
   *
   */
  _init() {
    if (this._href) {
      this._element = document.createElement(C.HTML.ANCHOR);

      const element = this._element;
      element.href = this._href;
      element.classList.add(C.CSSClass.TEXT_FIELD_ACTIVE);

      if (this._download) {
        element.target = C.HTML.ANCHOR_TARGET_SELF;
        element.download = "";
      } else {
        element.target = C.HTML.ANCHOR_TARGET_BLANK;
      }
    } else {
      this._element = document.createElement(C.HTML.DIV);

      const element = this._element;

      if (this._id) {
        this._elementClickHandler = this._elementClickHandler.bind(this);

        element.id = this._id;
        element.classList.add(C.CSSClass.TEXT_FIELD_ACTIVE);
        element.addEventListener(C.Event.CLICK, this._elementClickHandler);
      } else {
        if (this._footnote) {
          element.classList.add(C.CSSClass.TEXT_FIELD_FOOTNOTE);
        } else {
          if (!/\S/.test(this._label)) {
            element.classList.add(C.CSSClass.TEXT_FIELD_WHITESPACE);
          }
        }
      }
    }

    this._element.textContent = this._label;
  }

  /**
   * @description Mouse click event callback function.
   * @private
   * @function
   *
   */
  _elementClickHandler() {
    super.dispatch(C.Event.CLICK, this._id);
  }

  /**
   * @description Prepares the instance for safe nullification by releasing allocated internal objects for garbage collection.
   * @public
   * @function
   *
   */
  dispose() {
    super.dispose();

    this._element.removeEventListener(C.Event.CLICK, this._elementClickHandler);
    this._element = null;
  }

  /**
   * @description Gets the HTMLDivElement or HTMLAnchorElement.
   * @type {Object}
   * @readonly
   *
   */
  get element() {
    return this._element;
  }
}

/**
 * @description TextField class module
 * @module
 *
 */
export default TextField;
