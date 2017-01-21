/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');

/**
 * @constructor AST/Bin
 */
var Bin = Statement.extends(function(parent, type) {
  Statement.apply(this, [parent]);
  this.type = type || '+';
});

/**
 * Outputs the statement
 */
Bin.prototype.toString = function (indent) {
  // @todo handle operators like << or >>
  if (this._nodes.length === 2) {
    var buffer = this._nodes[0].toString(indent) + ' ' + this.type + ' ' + this._nodes[1].toString(indent);
    if (this._parent instanceof Statement) {
      return buffer;
    } else {
      return indent + buffer + ';\n';
    }
  } else {
    throw new Error('Binary expression expects a left and right nodes');
  }
};

module.exports = Bin;
