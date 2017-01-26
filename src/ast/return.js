/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');
var Fn = require('./function');
var AST = require('../ast');

/**
 * @constructor AST/Return
 */
var Return = Statement.extends(function(parent) {
  Statement.apply(this, [parent]);
});

/**
 * Outputs the statement
 */
Return.prototype.toString = function (indent) {
  var fn = this.parent(Fn);
  var buffer = 'return ';
  if (fn && fn.node.type) {
    buffer = '$result = ';
  }
  buffer += AST.prototype.toString.apply(this, [indent]);
  if (fn && fn.node.type) {
    if (this._parent instanceof Statement) {
      buffer = '(' + buffer + ', break)';
    } else {
      buffer += ';\n' + indent + 'break';
    }
  }
  if (this._parent instanceof Statement) {
    return buffer;
  } else {
    return indent + buffer + ';\n';
  }
};

module.exports = Return;
