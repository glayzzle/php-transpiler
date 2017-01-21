/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');

/**
 * @constructor AST/Assign
 */
var Assign = Statement.extends(function(parent, operator) {
  Statement.apply(this, [parent]);
  this.operator = operator || '=';
});

/**
 * Outputs the statement
 */
Assign.prototype.toString = function (indent) {
  // @todo handle operators like <=> or <<= or >>=
  if (this._nodes.length === 2) {
    var buffer = this._nodes[0].toString(indent) + ' ' + this.operator + ' ' + this._nodes[1].toString(indent);
    if (this._parent instanceof Statement) {
      return buffer;
    } else {
      return indent + buffer + ';\n';
    }
  } else {
    throw new Error('Assign statement expects a left and right nodes');
  }
};

module.exports = Assign;
