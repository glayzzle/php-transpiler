/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');

/**
 * @constructor AST/Include
 */
var Include = Statement.extends(function(parent, how) {
  Statement.apply(this, [parent]);
  this.method = how;
});

/**
 * Outputs the statement
 */
Include.prototype.toString = function (indent) {
  var buffer = '$php.' + this.method;
  buffer += '(' + this._nodes[0].toString(indent) + ')';
  if (this._parent instanceof Statement) {
    return buffer;
  } else {
    return indent + buffer + ';\n';
  }
};

module.exports = Include;
