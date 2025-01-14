/**
 * @description The <strong>constants.js</strong> module contains a collection of categoric constant member objects.
 * @module
 *
 */
export {
  Assets,
  Book,
  Bracket,
  Color,
  CSS,
  CSSAnimation,
  CSSClass,
  CSSID,
  Data,
  Event,
  HTML,
  HTMLElement,
  Key,
  Line,
  Loupe,
};

/**
 * @description Properties of type <strong>{string}</strong> consist of:
 * <ul>
 *     <li> CONTENT_MAP_URL </li>
 *     <li> LOUPE_URL </li>
 * </ul>
 *
 * @constant
 *
 */
const Assets = {
  CONTENT_MAP_URL: "./resources/build/data/contentMap.xml",
  LOUPE_URL: "./resources/build/images/Loupe.png",
};

Object.freeze(Assets);

/**
 * @description Properties of type <strong>{number}</strong> consist of:
 * <ul>
 *     <li> WIDTH </li>
 *     <li> HEIGHT </li>
 *     <li> GAP </li>
 *     <li> SCALE </li>
 *     <li> SKEW </li>
 * </ul>
 *
 * @constant
 *
 */
const Book = {
  WIDTH: 76,
  HEIGHT: 100,
  GAP: 10,
  SCALE: 0.14,
  SKEW: 0.66,
};

Object.freeze(Book);

/**
 * @description Properties of type <strong>{number}</strong> consist of:
 * <ul>
 *     <li> MARGIN </li>
 *     <li> MINIMUM_STEM_WIDTH </li>
 * </ul>
 *
 * @constant
 *
 */
const Bracket = {
  MARGIN: 7,
  MINIMUM_STEM_WIDTH: 16,
};

Object.freeze(Bracket);

/**
 * @description Properties of type <strong>{string}</strong> consist of:
 * <ul>
 *     <li> GRAY_CHANNEL </li>
 *     <li> THEME </li>
 * </ul>
 *
 * @constant
 *
 */
const Color = {
  GRAY_CHANNEL: "190",
  THEME: "#48BBEE",
};

Object.freeze(Color);

/**
 * @description Properties of type <strong>{string}</strong> consist of:
 * <ul>
 *     <li> AUTO </li>
 *     <li> BOTTOM </li>
 *     <li> LEFT </li>
 *     <li> NONE </li>
 *     <li> MARGIN_TOP </li>
 *     <li> MIN_HEIGHT </li>
 *     <li> MIN_WIDTH </li>
 *     <li> POSITION_ABSOLUTE </li>
 *     <li> POSITION_STATIC </li>
 *     <li> PX </li>
 *     <li> RIGHT </li>
 *     <li> SCALE </li>
 *     <li> TRANSLATE </li>
 * </ul>
 *
 * @constant
 *
 */
const CSS = {
  AUTO: "auto",
  BOTTOM: "bottom",
  LEFT: "left",
  NONE: "none",
  MARGIN_TOP: "margin-top",
  MIN_HEIGHT: "min-height",
  MIN_WIDTH: "min-width",
  POSITION_ABSOLUTE: "absolute",
  POSITION_STATIC: "static",
  PX: "px",
  RIGHT: "right",
  SCALE: "scale",
  TRANSLATE: "translate",
};

Object.freeze(CSS);

/**
 * @description Properties of type <strong>{string}</strong> consist of:
 * <ul>
 *     <li> BOOK_LEFT_PAGE </li>
 *     <li> BOOK_RIGHT_PAGE </li>
 *     <li> CONTENT_NODE_APPEND </li>
 *     <li> CONTENT_NODE_REMOVE </li>
 *     <li> FADE_IN </li>
 *     <li> FADE_OUT </li>
 *     <li> IMAGE_PRELOADER </li>
 *     <li> TEXT_FIELD_DESELECT </li>
 *     <li> TEXT_FIELD_SELECT </li>
 *     <li> TITLE </li>
 * </ul>
 *
 * @constant
 *
 */
const CSSAnimation = {
  BOOK_PAGE_LEFT: "animationBookPageLeft",
  BOOK_PAGE_RIGHT: "animationBookPageRight",
  CONTENT_NODE_APPEND: "animationContentNodeAppend",
  CONTENT_NODE_REMOVE: "animationContentNodeRemove",
  FADE_IN: "animationFadeIn",
  FADE_OUT: "animationFadeOut",
  IMAGE_PRELOADER: "animationImagePreloader",
  TEXT_FIELD_DESELECT: "animationTextFieldDeselect",
  TEXT_FIELD_SELECT: "animationTextFieldSelect",
  TITLE: "animationTitle",
};

Object.freeze(CSSAnimation);

/**
 * @description Properties of type <strong>{string}</strong> consist of:
 * <ul>
 *     <li> CONTENT_NODE </li>
 *     <li> CONTENT_NODE_LEAF </li>
 *     <li> CONTENT_NODE_ROOT </li>
 *     <li> LOUPE </li>
 *     <li> PICTURE </li>
 *     <li> SUSPEND_POINTER_EVENTS </li>
 *     <li> TEXT_FIELD_ACTIVE </li>
 *     <li> TEXT_FIELD_FOOTNOTE </li>
 *     <li> TEXT_FIELD_WHITESPACE </li>
 * </ul>
 *
 * @constant
 *
 */
const CSSClass = {
  CONTENT_NODE: "contentNode",
  CONTENT_NODE_LEAF: "contentNodeLeaf",
  CONTENT_NODE_ROOT: "contentNodeRoot",
  LOUPE: "loupe",
  PICTURE: "picture",
  SUSPEND_POINTER_EVENTS: "suspendPointerEvents",
  TEXT_FIELD_ACTIVE: "textFieldActive",
  TEXT_FIELD_FOOTNOTE: "textFieldFootnote",
  TEXT_FIELD_WHITESPACE: "textFieldWhitespace",
};

Object.freeze(CSSClass);

/**
 * @description Properties of type <strong>{string}</strong> consist of:
 * <ul>
 *     <li> BOOK </li>
 *     <li> BACKGROUND </li>
 *     <li> BRACKET </li>
 *     <li> CONTENT </li>
 *     <li> MASK </li>
 *     <li> OUTLINE </li>
 *     <li> PAGE_LEFT </li>
 *     <li> PAGE_RIGHT </li>
 *     <li> SKIN </li>
 *     <li> ZOOM </li>
 * </ul>
 *
 * @constant
 *
 */
const CSSID = {
  BACKGROUND: "background",
  BOOK: "book",
  BRACKET: "bracket",
  CONTENT: "content",
  MASK: "mask",
  OUTLINE: "outline",
  PAGE_LEFT: "pageLeft",
  PAGE_RIGHT: "pageRight",
  SKIN: "skin",
  ZOOM: "zoom",
};

Object.freeze(CSSID);

/**
 * @description Properties of type <strong>{string}</strong> consist of:
 * <ul>
 *     <li> ATTRIBUTE_DOWNLOAD </li>
 *     <li> ATTRIBUTE_FOOTNOTE </li>
 *     <li> ATTRIBUTE_HEIGHT </li>
 *     <li> ATTRIBUTE_HREF </li>
 *     <li> ATTRIBUTE_ID </li>
 *     <li> ATTRIBUTE_LABEL </li>
 *     <li> ATTRIBUTE_URL </li>
 *     <li> ATTRIBUTE_WIDTH </li>
 *     <li> ATTRIBUTE_ZOOMABLE </li>
 *     <li> BRANCH </li>
 *     <li> LEAF </li>
 *     <li> ROOT </li>
 * </ul>
 *
 * @constant
 *
 */
const Data = {
  ATTRIBUTE_DOWNLOAD: "download",
  ATTRIBUTE_FOOTNOTE: "footnote",
  ATTRIBUTE_HEIGHT: "height",
  ATTRIBUTE_HREF: "href",
  ATTRIBUTE_ID: "id",
  ATTRIBUTE_LABEL: "label",
  ATTRIBUTE_URL: "url",
  ATTRIBUTE_WIDTH: "width",
  ATTRIBUTE_ZOOMABLE: "zoomable",
  BRANCH: "branch",
  LEAF: "leaf",
  ROOT: "root",
};

Object.freeze(Data);

/**
 * @description Properties of type <strong>{string}</strong> consist of:
 * <ul>
 *     <li> ANIMATION_END </li>
 *     <li> CLICK </li>
 *     <li> CONTEXT_MENU </li>
 *     <li> DRAG_START </li>
 *     <li> KEYDOWN </li>
 *     <li> MOUSE_ENTER </li>
 *     <li> MOUSE_LEAVE </li>
 *     <li> MOUSE_MOVE </li>
 *     <li> MOUSE_WHEEL </li>
 *     <li> RESIZE </li>
 *     <li> UPDATE_CONTENT </li>
 * </ul>
 *
 * @constant
 *
 */
const Event = {
  ANIMATION_END: "animationend",
  CLICK: "click",
  CONTEXT_MENU: "contextmenu",
  DRAG_START: "dragstart",
  KEYDOWN: "keydown",
  MOUSE_ENTER: "mouseenter",
  MOUSE_LEAVE: "mouseleave",
  MOUSE_MOVE: "mousemove",
  MOUSE_WHEEL: "wheel",
  RESIZE: "resize",
  UPDATE_CONTENT: "updateContent",
};

Object.freeze(Event);

/**
 * @description Properties of type <strong>{string}</strong> consist of:
 * <ul>
 *     <li> ANCHOR </li>
 *     <li> ANCHOR_TARGET_BLANK </li>
 *     <li> ANCHOR_TARGET_SELF </li>
 *     <li> CANVAS </li>
 *     <li> CANVAS_RENDERING_CONTEXT_2D </li>
 *     <li> DIV </li>
 *     <li> IMG </li>
 *     <li> TYPE </li>
 * </ul>
 *
 * @constant
 *
 */
const HTML = {
  ANCHOR: "a",
  ANCHOR_TARGET_BLANK: "_blank",
  ANCHOR_TARGET_SELF: "_self",
  CANVAS_RENDERING_CONTEXT_2D: "2d",
  CANVAS: "canvas",
  DIV: "div",
  IMG: "img",
  TYPE: "type",
};

Object.freeze(HTML);

/**
 * @description Properties of type <strong>{Object}</strong> consist of:
 * <ul>
 *     <li> CONTENT </li>
 *     <li> ICON </li>
 *     <li> IMAGE </li>
 *     <li> MAIN </li>
 *     <li> TITLE </li>
 * </ul>
 *
 * @constant
 *
 */
const HTMLElement = {
  CONTENT: document.getElementById("content"),
  ICON: document.getElementById("icon"),
  MAIN: document.getElementsByTagName("main")[0],
  TITLE: document.getElementById("title"),
};

Object.freeze(HTMLElement);

/**
 * @description Properties of type <strong>{string}</strong> consist of:
 * <ul>
 *     <li> ARROW_DOWN </li>
 *     <li> ARROW_LEFT </li>
 *     <li> ARROW_RIGHT </li>
 *     <li> ARROW_UP </li>
 *     <li> DOWN </li>
 *     <li> LEFT </li>
 *     <li> RIGHT </li>
 *     <li> UP </li>
 * </ul>
 *
 * @constant
 *
 */
const Key = {
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  DOWN: "Down",
  LEFT: "Left",
  RIGHT: "Right",
  UP: "Up",
};

Object.freeze(Key);

/**
 * @description Properties of type <strong>{number}</strong> consist of:
 * <ul>
 *     <li> TRANSLATION </li>
 *     <li> WIDTH </li>
 * </ul>
 *
 * @constant
 *
 */
const Line = {
  TRANSLATION: 0.5,
  WIDTH: 1,
};

Object.freeze(Line);

/**
 * @description Properties of type <strong>{number}</strong> and <strong>{string}</strong> consist of:
 * <ul>
 *     <li> ZOOM_DEFAULT </li>
 *     <li> ZOOM_INSTRUCTION </li>
 *     <li> ZOOM_MAX </li>
 *     <li> ZOOM_STEP </li>
 *     <li> ZOOM_STEP_ACCELERATED </li>
 * </ul>
 *
 * @constant
 *
 */
const Loupe = {
  ZOOM_DEFAULT: 1.5,
  ZOOM_INSTRUCTION:
    "image zoom:  mouse over and scroll or press keyboard arrows.  hold shift to accelerate.",
  ZOOM_MAX: 4.0,
  ZOOM_STEP: 0.01,
  ZOOM_STEP_ACCELERATED: 0.1,
};

Object.freeze(Loupe);
