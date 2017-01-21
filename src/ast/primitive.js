/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Primitive
 */
var Primitive = AST.extends(function(parent, node) {
  AST.apply(this, [parent]);
  this.node = node;
});

/**
 * Outputs the primitive
 */
Primitive.prototype.toString = function () {
  if (this.node.kind === 'string') {
    return '\'' + this.node.value
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/'/g, '\\\'')
      + '\'';
  } else if (this.node.kind === 'number') {
    return this.node.value;
  } else if (this.node.kind === 'boolean') {
    return this.node.value ? 'true' : 'false';
  }
  throw new Error('Undefined primitive type : ' + this.node.kind);
};

module.exports = Primitive;
