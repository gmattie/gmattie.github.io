/**
 * @description The <strong>utils.js</strong> module contains a collection of helper functions.
 * @module
 *
 */
export { elementTransformMatrix };

/**
 * @typedef {Object} Matrix
 * @property {number} a  - The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
 * @property {number} b  - The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
 * @property {number} c  - The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
 * @property {number} d  - The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
 * @property {number} tx - The distance by which to translate each point along the x axis.
 * @property {number} ty - The distance by which to translate each point along the y axis.
 *
 */
const Matrix = {
  a: undefined,
  b: undefined,
  c: undefined,
  d: undefined,
  tx: undefined,
  ty: undefined,
};

Object.seal(Matrix);

/**
 * @description - Create a homogeneous 2D transformation matrix array comprised of six values which are derived from an HTMLElement's CSS "transform" property.
 * @param {Object} element - an HTMLElement with an assigned CSS "transform" property.
 * @returns {Matrix} - A 2D transformation matrix array.
 *
 */
function elementTransformMatrix(element) {
  const data = window
    .getComputedStyle(element, null)
    .getPropertyValue("transform");

  if (data) {
    const matrix = Object.assign({}, Matrix);
    const values = data
      .replace(/^.*\((.*)\)$/g, "$1")
      .split(/, +/)
      .map(Number);

    Object.keys(matrix).forEach((key, index) => {
      matrix[key] = values[index];
    });

    return matrix;
  }
}
