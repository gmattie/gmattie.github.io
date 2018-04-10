//Imports
import Dispatcher from "./Dispatcher.js";

/**
 * @description The <strong>Loader</strong> class instantiates asynchronous XMLHttpRequests
 * @requires Dispatcher
 * 
 * @example
 * const loader = new Loader("url", Loader.ResponseType.TEXT);
 * loader.addListener(Loader.Event.PROGRESS, loaderProgressHandler);
 * loader.addListener(Loader.Event.COMPLETE, loaderCompleteHandler);
 * loader.load();
 * 
 * function loaderProgressHandler(data) {
 * 
 *     console.log(data.loaded, data.total);
 * }
 * 
 * function loaderCompleteHandler(data) {
 * 
 *     console.log(data.response);
 * 
 *     const loader = data.target;
 * 
 *     // Calling loader.dispose(); will remove all listeners and nullify the loader object
 *
 *     loader.removeListener(Loader.Event.PROGRESS, loaderProgressHandler);
 *     loader.removeListener(Loader.Event.COMPLETE, loaderCompleteHandler);
 * }
 * 
 */
class Loader extends Dispatcher {

    /**
     * @param {string} url - A DOMString representing the URL that is sent to the XMLHttpRequest.
     * @param {string} responseType - The XMLHttpRequest.responseType property is an enumerated value that returns the type of the response. Valid arguments include "arraybuffer", "blob", "document", "json", or "text".
     * 
     */
    constructor(url, responseType) {

        super();

        this._url = url;

        this._XHRErrorHandler = this._XHRErrorHandler.bind(this);
        this._XHRProgressHandler = this._XHRProgressHandler.bind(this);
        this._XHRCompleteHandler = this._XHRCompleteHandler.bind(this);

        this._xhr = new XMLHttpRequest();
        this._xhr.responseType = responseType;
    }

    /**
     * @description XMLHttpRequest error event callback function.
     * @param {Object} event - The event object.
     * @private
     * @function
     * 
     */
    _XHRErrorHandler(event) {

        this._removeEventListeners(event.target);

        throw new Error("File Read Error");
    }

    /**
     * @description XMLHttpRequest progress event callback function.
     * @param {Object} event - The event object.
     * @private
     * @function
     * 
     */
    _XHRProgressHandler(event) {

        super.dispatch(Loader.Event.PROGRESS, {loaded: event.loaded, total: event.total});
    }

    /**
     * @description XMLHttpRequest complete event callback function.
     * @param {Object} event - The event object.
     * @private
     * @function
     * 
     */
    _XHRCompleteHandler(event) {

        const xhr = event.target;

        this._removeEventListeners(xhr);

        if (xhr.status === 404) {

            throw new Error("File Not Found");
        }

        super.dispatch(Loader.Event.COMPLETE, {target: this, response: xhr.response});
    }

    /**
     * @description Removes the <em>"error"</em>, <em>"progress"</em> and <em>"load"</em> event listeners from the XMLHttpRequest.
     * @param {Object} xhr - The XMLHttpRequest class instance.
     * @private
     * @function
     * 
     */
    _removeEventListeners(xhr) {

        xhr.removeEventListener(Loader.Event.ERROR, this._XHRErrorHandler);
        xhr.removeEventListener(Loader.Event.PROGRESS, this._XHRProgressHandler);
        xhr.removeEventListener("load", this._XHRCompleteHandler);
    }

    /**
     * @description Loads the XMLHttpRequest.
     * @public
     * @function
     * 
     */
    load() {

        const xhr = this._xhr;
        xhr.addEventListener(Loader.Event.ERROR, this._XHRErrorHandler);
        xhr.addEventListener(Loader.Event.PROGRESS, this._XHRProgressHandler);
        xhr.addEventListener("load", this._XHRCompleteHandler);
        xhr.open("GET", this._url);
        xhr.send();
    }

    /**
     * @description Aborts the XMLHttpRequest.
     * @public
     * @function
     * 
     */
    abort() {

        this._removeEventListeners(this._xhr);
        this._xhr.abort();
    }

    /**
     * @description Prepares the instance for safe nullification by releasing allocated internal objects for garbage collection.
     * @public
     * @function
     * 
     */
    dispose() {

        this.abort();
        super.dispose();

        this._xhr = null;
    }

    /**
     * @description Properties of type <strong>{string}</strong> consist of:
     * <ul>
     *     <li> COMPLETE </li>
     *     <li> ERROR </li>
     *     <li> PROGRESS </li>
     * </ul>
     * 
     * @static
     * @constant
     * 
     */
    static get Event() {

        return {

            COMPLETE: "complete",
            ERROR: "error",
            PROGRESS: "progress"
        };
    }

    /**
     * @description Properties of type <strong>{string}</strong> consist of:
     * <ul>
     *     <li> ARRAY_BUFFER </li>
     *     <li> BLOB </li>
     *     <li> DOCUMENT </li>
     *     <li> JSON </li>
     *     <li> TEXT </li>
     * </ul>
     * 
     * @static
     * @constant
     * 
     */
    static get ResponseType() {

        return {

            ARRAY_BUFFER: "arraybuffer",
            BLOB: "blob",
            DOCUMENT: "document",
            JSON: "json",
            TEXT: "text"
        };
    }
}

/**
 * @description Loader class module
 * @module
 * 
 */
export default Loader;