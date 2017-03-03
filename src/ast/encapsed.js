/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');

/**
 * @constructor AST/Encapsed
 */
var Encapsed = Statement.extends(function(parent) {
  Statement.apply(this, [parent]);
});

/**
 * Outputs the statement
 */
Encapsed.prototype.toString = function (indent) {
  var buffers = [];
  for(var i = 0; i < this._nodes.length; i++) {
    buffers.push(this._nodes[i].toString(indent));
  }
  if (this._parent instanceof Statement) {
    return buffers.join(' + ');
  } else {
    return indent + buffers.join(' + ') + ';\n';
  }
};

module.exports = Encapsed;
