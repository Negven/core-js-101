/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return new proto.constructor(...Object.values(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

function copyObj(obj) {
  const newObj = {};
  Object.keys(obj).map((key) => {
    newObj[key] = obj[key];
    return key;
  });
  return newObj;
}

const cssSelectorBuilder = {
  value: '',
  selectors: '',

  err1: 'Element, id and pseudo-element should not occur more then one time inside the selector',
  err2: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',

  element(value) {
    if (this.selectors.includes('element')) {
      throw new Error(this.err1);
    }
    if (this.selectors !== '') {
      throw new Error(this.err2);
    }
    const ret = copyObj(this);
    ret.value += value;
    ret.selectors += ' element';
    return ret;
  },

  id(value) {
    if (this.selectors.includes('id')) {
      throw new Error(this.err1);
    }
    ['class', 'attr', 'pseudoClass', 'pseudoElement'].forEach((sel) => {
      if (this.selectors.includes(sel)) {
        throw new Error(this.err2);
      }
    });
    const ret = copyObj(this);
    ret.value += `#${value}`;
    ret.selectors += ' id';
    return ret;
  },

  class(value) {
    ['attr', 'pseudoClass', 'pseudoElement'].forEach((sel) => {
      if (this.selectors.includes(sel)) {
        throw new Error(this.err2);
      }
    });
    const ret = copyObj(this);
    ret.value += `.${value}`;
    ret.selectors += ' class';
    return ret;
  },

  attr(value) {
    ['pseudoClass', 'pseudoElement'].forEach((sel) => {
      if (this.selectors.includes(sel)) {
        throw new Error(this.err2);
      }
    });
    const ret = copyObj(this);
    ret.selectors += ' attr';
    ret.value += `[${value}]`;
    return ret;
  },

  pseudoClass(value) {
    ['pseudoElement'].forEach((sel) => {
      if (this.selectors.includes(sel)) {
        throw new Error(this.err2);
      }
    });
    const ret = copyObj(this);
    ret.selectors += ' pseudoClass';
    ret.value += `:${value}`;
    return ret;
  },

  pseudoElement(value) {
    if (this.selectors.includes('pseudoElement')) {
      throw new Error(this.err1);
    }
    const ret = copyObj(this);
    ret.value += `::${value}`;
    ret.selectors += ' pseudoElement';
    return ret;
  },

  combine(selector1, combinator, selector2) {
    const ret = copyObj(this);
    ret.value += `${selector1.value} ${combinator} ${selector2.value}`;
    return ret;
  },

  stringify() {
    return this.value;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
