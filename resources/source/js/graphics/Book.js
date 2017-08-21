//Imports
import * as C from "../support/constants.js";

/**
 * @description The <strong>Book</strong> class instantiates an HTMLDivElement with the ID <em>"book"</em> that contains HTMLCanvasElement with IDs <em>"leftPage"</em> and <em>"rightPage"</em>.
 * @class
 * @requires constants
 * 
 */
class Book {

    /**
     * @param {number} scale - The size of the icon relative to its default height of 100 pixels.
     * @param {string} color - A 24-bit RGB hexadecimal value. 
     * 
     */
    constructor(scale, color) {

        this._scale = scale;
        this._color = color;

        this._init();
    }

    /**
     * @description Instantiates the HTMLDivElement container.
     * @private
     * @function
     * 
     */
    _init() {

        this._element = document.createElement(C.HTML.DIV);

        const element = this._element;
        element.id = C.CSSID.BOOK;
        element.style.lineHeight = 0;

        this._draw();
    }

    /**
     * @description Creates or recreates the HTMLCanvasElement objects.
     * @private
     * @function
     * 
     */
    _draw() {
        
        this._leftPageCanvas = document.createElement(C.HTML.CANVAS);

        const leftPageCanvas = this._leftPageCanvas;
        leftPageCanvas.id = C.CSSID.PAGE_LEFT;
        leftPageCanvas.width = C.Book.WIDTH * this._scale;
        leftPageCanvas.height = C.Book.HEIGHT * this._scale;
        leftPageCanvas.style.transformOrigin = `${C.CSS.RIGHT} ${C.CSS.BOTTOM}`;

        const leftPageContext = leftPageCanvas.getContext(C.HTML.CANVAS_RENDERING_CONTEXT_2D);
        leftPageContext.fillStyle = this._color;
        leftPageContext.transform(1, C.Book.SKEW, 0, 1, 0, 0);
        leftPageContext.fillRect(0, 0, C.Book.WIDTH * this._scale, C.Book.HEIGHT / 2 * this._scale);
        leftPageContext.fill();

        this._rightPageCanvas = document.createElement(C.HTML.CANVAS);

        const rightPageCanvas = this._rightPageCanvas;
        rightPageCanvas.id = C.CSSID.PAGE_RIGHT;
        rightPageCanvas.width = C.Book.WIDTH * this._scale;
        rightPageCanvas.height = C.Book.HEIGHT * this._scale;
        rightPageCanvas.style.transformOrigin = `${C.CSS.LEFT} ${C.CSS.BOTTOM}`;

        const rightPageContext = rightPageCanvas.getContext(C.HTML.CANVAS_RENDERING_CONTEXT_2D);
        rightPageContext.fillStyle = this._color;
        rightPageContext.transform(1, -C.Book.SKEW, 0, 1, 0, C.Book.HEIGHT / 2 * this._scale);
        rightPageContext.fillRect(C.Book.GAP * this._scale, 0, C.Book.WIDTH * this._scale, C.Book.HEIGHT / 2 * this._scale);
        rightPageContext.fill();

        while (this._element.firstChild) {
            
            this._element.removeChild(this._element.firstChild);
        }

        const element = this._element;
        element.appendChild(leftPageCanvas);
        element.appendChild(rightPageCanvas);
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

        this._element = null;
        this._leftPageCanvas = null;
        this._rightPageCanvas = null;
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
     * @description The size of the icon relative to its default height of 100 pixels.
     * @type {number}
     * 
     */
    set scale(value) {

        this._scale = value;
        this._draw();
    }

    get scale() {
        
        return this._scale;
    }

    /**
     * @description A 24-bit RGB hexadecimal value.
     * @type {string}
     * 
     */
    set color(value) {

        this._color = value;
        this._draw();
    }

    get color() {
        
        return this._color;
    }
}

/**
 * @description Book class module
 * @module
 * 
 */
export default Book;