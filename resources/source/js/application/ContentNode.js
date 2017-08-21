//Imports
import * as C from "../support/constants.js";
import * as Utils from "../support/utils.js";
import Bracket from "../graphics/Bracket.js";
import Dispatcher from "../support/Dispatcher.js";
import Picture from "./Picture.js";
import TextField from "./TextField.js";

/**
 * @description The <strong>ContentNode</strong> class instantiates and populates HTMLElement Node objects based on application content data.
 * @class
 * @requires constants
 * @requires utils
 * @requires Bracket
 * @requires Dispatcher
 * @requires Picture
 * @requires TextField
 * 
 */
class ContentNode extends Dispatcher {

    /**
     * @param {Object} contentParentNode - Node object from the application content data used to populate the HTMLDivElement container.
     * @param {number} bracketStemWidth - The width of the <strong>Bracket</strong> object stem measured from the HTMLDivElement container to the <strong>TextField</strong> that instantiated the class.
     * @param {number} bracketStemHeight - The height of the <strong>Bracket</strong> object stem measured to the vertical center of the <strong>TextField</strong> that instantiated the class.
     * @param {boolean} isMobileDevice - A flag that determines if the deployment target is a mobile device.
     * 
     */
    constructor(contentParentNode, bracketStemWidth, bracketStemHeight, isMobileDevice) {

        super(); 

        this._contentParentNode = contentParentNode;
        this._bracketStemWidth = bracketStemWidth;
        this._bracketStemHeight = bracketStemHeight;
        this._isMobileDevice = isMobileDevice;

        this._init();
    }
    
    /**
     * @description instantiates and populates HTMLElement Node objects based on application content data.
     * @private
     * @function
     * 
     */
    _init() {

        if (this._contentParentNode instanceof Node && this._contentParentNode.nodeType === Node.ELEMENT_NODE && this._contentParentNode.hasChildNodes()) {

            const nodeType = this._contentParentNode.nodeName;

            this._element = document.createElement(C.HTML.DIV);
            this._element.id = this._contentParentNode.id;
            this._element.setAttribute(C.HTML.TYPE, nodeType);

            this._appendChildNodes(C.Data.ATTRIBUTE_URL, this._createPicture.bind(this));
            this._appendChildNodes(C.Data.ATTRIBUTE_LABEL, this._createTextField.bind(this));

            if (nodeType === C.Data.ROOT) {

                this._element.classList.add(C.CSSClass.CONTENT_NODE_ROOT);
            }
            else {
                
                this._bracket = new Bracket(this._bracketStemWidth, this._bracketStemHeight);
                this._element.appendChild(this._bracket.element);
                
                if (nodeType === C.Data.LEAF) {

                    this._element.classList.add(C.CSSClass.CONTENT_NODE_LEAF);
                    this._createLeafMutationObserver();

                    if (this._picture) {

                        if (this._picture.isZoomable) {
                            
                            const footnoteNode = document.createElement(C.HTML.DIV);
                            footnoteNode.setAttribute(C.Data.ATTRIBUTE_LABEL, C.Loupe.ZOOM_INSTRUCTION);
                            footnoteNode.setAttribute(C.Data.ATTRIBUTE_FOOTNOTE, C.Data.ATTRIBUTE_FOOTNOTE);

                            this._element.appendChild(this._createTextField(footnoteNode).element);
                        }

                        this._element.insertBefore(this._bracket.element, this._picture.element);
                    }
                }
                else {

                    this._element.classList.add(C.CSSClass.CONTENT_NODE);
                    this._bracket.draw(this._elementClientRect().height);
                }
            }
        }
        else {

            throw new Error("Invalid constructor argument.");
        }
    }

    /**
     * @description Initializes and appends HTMLElement Node objects to the class's <strong>element</strong> property.
     * @param {string} nodeAttribute - Used to filter the appropriate application content data to be sent to the supplied factory function.
     * @param {Function} nodeFactoryFunction - A function that appropriately handles the filtered Node object from the application content data.
     * @private
     * @function
     * 
     */
    _appendChildNodes(nodeAttribute, nodeFactoryFunction) {

        const childNodes = this._contentParentNode.childNodes;
        
        for (const child of childNodes) {

            if (child.nodeType === Node.ELEMENT_NODE) {

                if (child.getAttribute(nodeAttribute)) {

                    const node = nodeFactoryFunction(child);

                    this._element.appendChild(node.element);
                }
            }
        }
    }

    /**
     * @description A factory function that creates a <strong>Picture</strong> object.
     * @param {Object} elementNode - Node object from the application content data used to populate a <strong>Picture</strong> object.
     * @private
     * @function
     * 
     */
    _createPicture(elementNode) {

        const url = elementNode.getAttribute(C.Data.ATTRIBUTE_URL);
        const width = parseInt(elementNode.getAttribute(C.Data.ATTRIBUTE_WIDTH));
        const height = parseInt(elementNode.getAttribute(C.Data.ATTRIBUTE_HEIGHT));
        const isZoomable = elementNode.getAttribute(C.Data.ATTRIBUTE_ZOOMABLE) && !this._isMobileDevice;

        this._picture = new Picture(url, width, height, isZoomable);
         
        return this._picture;
    }

    /**
     * @description A factory function that creates a <strong>TextField</strong> object.
     * @param {Object} elementNode - Node object from the application content data used to populate a <strong>TextField</strong> object.
     * @private
     * @function
     * 
     */
    _createTextField(elementNode) {

        const label = elementNode.getAttribute(C.Data.ATTRIBUTE_LABEL);
        const id = elementNode.getAttribute(C.Data.ATTRIBUTE_ID);
        const href = elementNode.getAttribute(C.Data.ATTRIBUTE_HREF);
        const download = elementNode.getAttribute(C.Data.ATTRIBUTE_DOWNLOAD);
        const footnote = elementNode.hasAttribute(C.Data.ATTRIBUTE_FOOTNOTE);
        
        if (!this._textFields) {

            this._textFields = [];
        }

        this._textFields.unshift(new TextField(label, id, href, download, footnote));

        if (elementNode.hasChildNodes()) {

            this._textFields[0].addListener(C.Event.CLICK, (id) => super.dispatch(C.Event.UPDATE_CONTENT, id));
        }

        return this._textFields[0];
    }

    /**
     * @description Creates a <strong>MutationObserver<strong> object on class instances of type <strong>C.Data.LEAF</strong> that facilitates responsive resizing.
     * @private
     * @function
     * 
     */
    _createLeafMutationObserver() {

        if (this._contentParentNode.nodeName === C.Data.LEAF) {
        
            this._windowResizeHandler = this._windowResizeHandler.bind(this);
            this._containsTransformProperty = true;

            this._mutationObserver = new MutationObserver((mutations) => {

                const picture = this._picture;

                if (mutations[0].target.parentNode) {

                    if (this._containsTransformProperty) {

                        const matrix = Utils.elementTransformMatrix(this._element);
                        this._updateLeafSize(matrix.tx, matrix.ty);
                        this._containsTransformProperty = false;
                    }

                     window.addEventListener(C.Event.RESIZE, this._windowResizeHandler);

                     if (picture && !picture.isLoaded && !picture.isLoading) {

                        picture.load();
                    }
                }
                else {

                    window.removeEventListener(C.Event.RESIZE, this._windowResizeHandler);

                    if (picture) {

                        picture.dispose();
                    }
                }
            });
            
            this._mutationObserver.observe(this._element, { attributes: true });
        }
    }

    /**
     * @description Gets the size of the class's <strong>element</strong> property and its position relative to the viewport.
     * @private
     * @function
     * 
     */
    _elementClientRect() {

        const content = C.HTMLElement.CONTENT;

        let clientRect;

        if (content.contains(this._element)) {

            clientRect = this._element.getBoundingClientRect();
        }
        else {

            content.appendChild(this._element);
            clientRect = this._element.getBoundingClientRect();
            content.removeChild(this._element);
        }

        return clientRect;
    }

    /**
     * @description Updates the size of the class's <strong>element</strong> property of type <strong>C.Data.LEAF</strong>.
     * @param {number} [offsetWidth = 0] - Value that negates added width caused by a CSS transformation along the x-axis.
     * @param {number} [offsetHeight = 0] - Value that negates added height caused by a CSS transformation along the y-axis.
     * @private
     * @function
     * 
     */
    _updateLeafSize(offsetWidth = 0, offsetHeight = 0) {
    
        const viewPort = {

            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };

        if (this._previousViewPort && viewPort.width === this._previousViewPort.width && viewPort.height === this._previousViewPort.height) {

            return;
        }

        const elementPosition = this._elementClientRect();
        const margin = parseFloat(window.getComputedStyle(C.HTMLElement.MAIN, null).getPropertyValue(C.CSS.MARGIN_TOP));
        const maxWidth = viewPort.width - elementPosition.left - margin + offsetWidth;
        const picture = this._picture;

        this._element.style.width = `${maxWidth}${C.CSS.PX}`;

        if (picture) {

            if (!this._pictureMinWidth) {

                this._pictureMinWidth = parseFloat(window.getComputedStyle(picture.element, null).getPropertyValue(C.CSS.MIN_WIDTH));
            }

            picture.element.style.position = C.CSS.POSITION_ABSOLUTE;
            
            const textHeight = this._elementClientRect().height;
            const maxHeight = viewPort.height - elementPosition.top - textHeight - margin + offsetHeight;
            
            picture.element.style.position = C.CSS.POSITION_STATIC;

            const pictureOffsetX = elementPosition.left - offsetWidth;
            const pictureOffsetY = elementPosition.top - offsetHeight;

            picture.resize(maxWidth, maxHeight, this._pictureMinWidth, pictureOffsetX, pictureOffsetY);
        }

        const elementHeight = this._elementClientRect().height;
        
        this._bracket.draw(elementHeight);

        this._previousViewPort = {

            width: viewPort.width,
            height: viewPort.height
        };
    }

    /**
     * @description <strong>Window</strong> resize event callback function.
     * @private
     * @function
     * 
     */
    _windowResizeHandler() {

        this._updateLeafSize();
    }

    /**
     * @description Prepares the instance for safe nullification by releasing allocated internal objects for garbage collection.
     * @public
     * @function
     * 
     */
    dispose() {

        super.dispose();

        while (this._element.firstChild) {
            
            this._element.removeChild(this._element.firstChild);
        }

        this._element = null;

        if (this._picture) {

            this._picture.dispose();
            this._picture = null;
        }

        if (this._textFields) {

            for (let textField of this._textFields) {

                textField.dispose();
            }

            this._textFields = null;
        }

        if (this._bracket) {

            this._bracket.dispose();
            this._bracket = null;
        }

        if (this._mutationObserver) {

            this._mutationObserver.disconnect();
            this._mutationObserver = null;
        }

        window.removeEventListener(C.Event.RESIZE, this._windowResizeHandler);
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
}

/**
 * @description ContentNode class module
 * @module
 * 
 */
export default ContentNode;