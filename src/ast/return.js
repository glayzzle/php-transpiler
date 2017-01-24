/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');
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
  var buffer = 'return ';
  buffer += AST.prototype.toString.apply(this, [indent]);
  if (this._parent instanceof Statement) {
    return buffer;
  } else {
    return indent + buffer + ';\n';
  }
};

module.exports = Return;
