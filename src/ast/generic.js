/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');
var AST = require('../ast');

/**
 * @constructor AST/Generic
 */
var Generic = Statement.extends(function(parent, options) {
  Statement.apply(this, [parent]);
  this.options = options;
});

/**
 * Outputs the statement
 */
Generic.prototype.toString = function (indent) {
  var buffer = '';
  if (this.options.pre) {
    if (typeof this.options.pre === 'function') {
      buffer += this.options.pre.apply(this, [indent]);
    } else {
      buffer += this.options.pre;
    }
  }
  buffer += AST.prototype.toString.apply(this, [indent]);
  if (this.options.post) {
    if (typeof this.options.post === 'function') {
      buffer += this.options.post.apply(this, [indent]);
    } else {
      buffer += this.options.post;
    }
  }
  if (this._parent instanceof Statement) {
    return buffer;
  } else {
    return indent + buffer + ';\n';
  }
};

module.exports = Generic;
