//imports
import * as C from "../support/constants.js";
import Book from "../graphics/Book.js";
import ContentNode from "./ContentNode.js";
import Loader from "../support/Loader.js";

/**
 * @description The <strong>Controller</strong> class initializes the primary data structure and is responsible for displaying and maintaining the proper flow of the application based on user interaction.
 * @class
 * @requires constants
 * @requires Book
 * @requires ContentNode
 * @requires Loader
 * 
 */
class Controller {

    /**
     * @description Initiates loading of the application content data.
     * @public
     * @function
     * 
     */
    init() {

        this._isMobileDevice = window.navigator.userAgent.toLowerCase().includes("mobi");

        if (!this._isMobileDevice) {

            document.addEventListener(C.Event.KEYDOWN, (event) => {
                
                switch (event.key) {

                    case C.Key.ARROW_DOWN:
                    case C.Key.DOWN:
                    case C.Key.ARROW_LEFT:
                    case C.Key.LEFT:
                    case C.Key.ARROW_RIGHT:
                    case C.Key.RIGHT:
                    case C.Key.ARROW_UP:
                    case C.Key.UP:

                        event.preventDefault();

                        break;
                }
            });
        }

        this._contentNodeMap = new Map();

        this._dataLoaderCompleteHandler = this._dataLoaderCompleteHandler.bind(this);
        this._deselectAnimationEndHandler = this._deselectAnimationEndHandler.bind(this);
        this._removeAnimationEndHandler = this._removeAnimationEndHandler.bind(this);
        this._updateContentHandler = this._updateContentHandler.bind(this);
        this._appendContentAnimationEndHandler = this._appendContentAnimationEndHandler.bind(this);
        this._bookPageRightAnimationEndHandler = this._bookPageRightAnimationEndHandler.bind(this);

        const dataLoader = new Loader(C.Assets.CONTENT_MAP_URL, Loader.ResponseType.DOCUMENT);
        dataLoader.addListener(Loader.Event.COMPLETE, this._dataLoaderCompleteHandler);
        dataLoader.load();
    }

    /**
     * @description Application content data complete event callback function.
     * @param {Object} data - An object containing <em>"target"</em> and <em>"response"</em> properties.
     * @private
     * @function
     * 
     */
    _dataLoaderCompleteHandler(data) {

        const dataLoader = data.target;
        dataLoader.removeListener(Loader.Event.COMPLETE, this._dataLoaderCompleteHandler);

        this._data = data.response;

        const book = new Book(C.Book.SCALE, C.Color.THEME);

        C.HTMLElement.ICON.appendChild(book.element);
        C.HTMLElement.CONTENT.classList.add(C.CSSClass.SUSPEND_POINTER_EVENTS);

        this._appendContent(C.Data.ROOT);
    }

    /**
     * @description Visually updates the application based on user interaction.
     * @param {string} textFieldID - The ID of the selected <strong>TextField</strong> object mapped to the application content data that determines which content to add and, conditionally, remove.
     * @private
     * @function
     * 
     */
    _updateContentHandler(textFieldID) {

        this._selectedTextFieldID = textFieldID;
        
        C.HTMLElement.CONTENT.classList.add(C.CSSClass.SUSPEND_POINTER_EVENTS);
        
        const selectedTextField = document.getElementById(this._selectedTextFieldID);
        selectedTextField.classList.remove(C.CSSClass.TEXT_FIELD_ACTIVE);
        
        const selectedParentNode = selectedTextField.parentNode;
        
        this._removeContent(selectedParentNode);
    }

    /**
     * @description Recursively removes HTMLElement Node objects from the Document Object Model.
     * @param {Object} contentElement - The previous sibling of the HTMLElement Node to remove from the Document Object Model.
     * @private
     * @function
     * 
     */
    _removeContent(contentElement) {

        if (contentElement.getAttribute(C.HTML.TYPE) !== C.Data.LEAF) {

            const textElements = contentElement.childNodes;

            for (const textElement of textElements) {

                if (textElement.nodeType === Node.ELEMENT_NODE && textElement.classList.contains(C.CSSAnimation.TEXT_FIELD_SELECT)) {

                    textElement.addEventListener(C.Event.ANIMATION_END, this._deselectAnimationEndHandler);
                    textElement.classList.remove(C.CSSAnimation.TEXT_FIELD_SELECT);
                    textElement.classList.add(C.CSSAnimation.TEXT_FIELD_DESELECT);

                    break;
                }
            }
        }

        if (!this._contentLastChild) {

            const sibling = contentElement.nextSibling;

            if (sibling && sibling.nodeType === Node.ELEMENT_NODE) {

                if (sibling === C.HTMLElement.CONTENT.lastChild) {

                    this._contentLastChild = sibling;
                }

                sibling.addEventListener(C.Event.ANIMATION_END, this._removeAnimationEndHandler);
                sibling.classList.remove(C.CSSAnimation.CONTENT_NODE_APPEND);
                sibling.classList.add(C.CSSAnimation.CONTENT_NODE_REMOVE);

                this._removeContent(sibling);
            }
            else {

                this._appendContent(this._selectedTextFieldID);
            }
        }
    }

    /**
     * @description Deselect CSS animation end callback function.
     * @param {Object} event - The CSS animation event object.
     * @private
     * @function
     * 
     */
    _deselectAnimationEndHandler(event) {

        const textElement = event.target;
        textElement.removeEventListener(C.Event.ANIMATION_END, this._deselectAnimationEndHandler);
        textElement.classList.remove(C.CSSAnimation.TEXT_FIELD_DESELECT);
        textElement.classList.remove(C.CSSClass.SUSPEND_POINTER_EVENTS);
        textElement.classList.add(C.CSSClass.TEXT_FIELD_ACTIVE);
    }

    /**
     * @description Remove CSS animation end callback function.
     * @param {Object} event - The CSS animation event object.
     * @private
     * @function
     * 
     */
    _removeAnimationEndHandler(event) {

        const contentElement = event.target;
        contentElement.removeEventListener(C.Event.ANIMATION_END, this._removeAnimationEndHandler);
        contentElement.classList.remove(C.CSSAnimation.CONTENT_NODE_REMOVE);

        C.HTMLElement.CONTENT.removeChild(contentElement);

        if (this._contentLastChild === contentElement) {

            this._contentLastChild = null;

            /**
             * Employing a setTimeout() with zero milliseconds solves a bug in Chrome where getBoundingClientRect() values are
             * not being recalculated when required.  This approach forces a reflow/repaint before appending a new instance of
             * ContentNode so that getBoundingClientRect() values are always recalculated rather than retrieving previous values
             * sanctioned by Chrome for the purpose of optimization and performance.
             * 
             */
            setTimeout(() => this._appendContent(this._selectedTextFieldID), 0);
        }

        const contentNodeKey = contentElement.id;
        const contentNodeMap = this._contentNodeMap;
        const contentNode = contentNodeMap.get(contentNodeKey);
        
        contentNode.dispose();
        contentNodeMap.delete(contentNodeKey);
    }

    /**
     * @description Initializes and appends a <strong>ContentNode</strong> object to the Document Object Model.
     * @param {string} ID - The ID that determines which content to initialize and append.
     * @private
     * @function
     *  
     */
    _appendContent(ID) {

        let bracketStemWidth;
        let bracketStemHeight;

        const selectedTextField = document.getElementById(ID);

        if (selectedTextField) {

            selectedTextField.classList.add(C.CSSClass.SUSPEND_POINTER_EVENTS);
            selectedTextField.classList.add(C.CSSAnimation.TEXT_FIELD_SELECT);

            const parentIsRoot = (selectedTextField.parentElement.getAttribute(C.HTML.TYPE) === C.Data.ROOT);
            const textFieldHeight = selectedTextField.clientHeight;

            bracketStemWidth = (parentIsRoot) ? 0 : selectedTextField.parentElement.clientWidth - selectedTextField.clientWidth;
            bracketStemHeight = textFieldHeight * Array.from(selectedTextField.parentElement.children).indexOf(selectedTextField) + textFieldHeight / 2;
        }

        const contentParentNode = this._data.getElementById(ID);

        const contentNodeMap = this._contentNodeMap;
        contentNodeMap.set(ID, new ContentNode(contentParentNode, bracketStemWidth, bracketStemHeight, this._isMobileDevice));

        const contentNode = contentNodeMap.get(ID);
        contentNode.addListener(C.Event.UPDATE_CONTENT, this._updateContentHandler);
        contentNode.element.addEventListener(C.Event.ANIMATION_END, this._appendContentAnimationEndHandler);
    
        C.HTMLElement.CONTENT.appendChild(contentNode.element);

        if (ID !== C.Data.ROOT) {

            contentNode.element.classList.add(C.CSSAnimation.CONTENT_NODE_APPEND);
        }
        else {

            this._initLaunchAnimation();
        }
    }

    /**
     * @description Append content CSS animation end callback function.
     * @param {Object} event - The CSS animation event object.
     * @private
     * @function
     * 
     */
    _appendContentAnimationEndHandler(event) {

        const contentElement = event.target;
        contentElement.removeEventListener(C.Event.ANIMATION_END, this._appendContentAnimationEndHandler);

        C.HTMLElement.CONTENT.classList.remove(C.CSSClass.SUSPEND_POINTER_EVENTS);
    }

    /**
     * @description Initializes the application launch animation.
     * @private
     * @function
     * 
     */
    _initLaunchAnimation() {

        const rightPage = document.getElementById(C.CSSID.PAGE_RIGHT);
        rightPage.addEventListener(C.Event.ANIMATION_END, this._bookPageRightAnimationEndHandler);
        rightPage.classList.add(C.CSSAnimation.BOOK_PAGE_RIGHT);

        C.HTMLElement.TITLE.classList.add(C.CSSAnimation.TITLE);
    }

    /**
     * @description Book page right CSS animation end callback function.
     * @param {Object} event - The CSS animation event object.
     * @private
     * @function
     * 
     */
    _bookPageRightAnimationEndHandler(event) {

        event.target.removeEventListener(C.Event.ANIMATION_END, this._bookPageRightAnimationEndHandler);

        const leftPage = document.getElementById(C.CSSID.PAGE_LEFT);
        leftPage.classList.add(C.CSSAnimation.BOOK_PAGE_LEFT);

        const root = document.querySelector(`.${C.CSSClass.CONTENT_NODE_ROOT}`);
        root.classList.add(C.CSSAnimation.CONTENT_NODE_APPEND);
    }
}

/**
 * @description Controller class module
 * @module
 * 
 */
export default Controller;