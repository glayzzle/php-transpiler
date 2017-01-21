/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Statement
 */
var Statement = AST.extends(function(parent) {
  AST.apply(this, [parent]);
});

/**
 * Outputs the statement
 */
Statement.prototype.toString = function (indent) {
  var buffer = '';
  for(var i = 0; i < this._nodes.length; i++) {
    buffer += indent + this._nodes[i].toString(indent) + ';\n';
  }
  return buffer;
};

module.exports = Statement;
