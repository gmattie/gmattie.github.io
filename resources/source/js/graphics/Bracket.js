//Imports
import * as C from "../support/constants.js";

/**
 * @description The <strong>Bracket</strong> class instantiates resizable graphics within an HTMLCanvasElement.
 * @class
 * @requires constants
 * 
 */
class Bracket {

    /**
     * @param {number} stemWidth - The width of the stem measured from the <strong>ContentNode</strong> parent object to the calling <strong>TextField</strong> object.
     * @param {number} stemHeight - The height of the stem measured from the <strong>ContentNode</strong> parent object to the vertical center of the calling <strong>TextField</strong> object.
     * 
     */
    constructor(stemWidth, stemHeight) {

        this._stemWidth = stemWidth + C.Bracket.MINIMUM_STEM_WIDTH;
        this._stemHeight = Math.floor(stemHeight) + C.Bracket.MARGIN;

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
        canvas.id = C.CSSID.BRACKET;
        canvas.width = this._stemWidth + C.Bracket.MARGIN + Math.ceil(C.Line.TRANSLATION);
        canvas.height = Math.max(window.screen.width, window.screen.height);
        canvas.style.top = `-${C.Bracket.MARGIN}${C.CSS.PX}`;
        canvas.style.left = `-${canvas.width + C.Bracket.MARGIN}${C.CSS.PX}`;
        
        this._context = canvas.getContext(C.HTML.CANVAS_RENDERING_CONTEXT_2D);

        const context = this._context;
        context.strokeStyle = C.Color.THEME;
        context.lineWidth = C.Line.WIDTH;
        context.translate(C.Line.TRANSLATION, C.Line.TRANSLATION);
    }

    /**
     * @description Draws or redraws the CanvasRenderingContext2D object.
     * @param {number} height - The height to draw the Bracket according to the height of its <strong>ContentNode</strong> parent object.
     * @public
     * @function
     * 
     */
    draw(height) {
        
        const context = this._context;
        const width = context.canvas.width - Math.ceil(C.Line.TRANSLATION);

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.beginPath();

        context.moveTo(width, 0);
        context.lineTo(width - C.Bracket.MARGIN, 0);
        context.lineTo(width - C.Bracket.MARGIN, height + C.Bracket.MARGIN * 2);
        context.lineTo(width, height + C.Bracket.MARGIN * 2);

        context.moveTo(0, this._stemHeight);
        context.lineTo(this._stemWidth, this._stemHeight);

        if (this._stemHeight > height) {

            context.lineTo(this._stemWidth, height + C.Bracket.MARGIN * 2);
        }

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
 * @description Bracket class module
 * @module
 * 
 */
export default Bracket;