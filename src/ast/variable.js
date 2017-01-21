/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Variable
 */
var Variable = AST.extends(function(parent, node) {
  AST.apply(this, [parent]);
  this.node = node;
});

/**
 * Outputs the variable
 */
Variable.prototype.toString = function () {
  // @todo handle byref
  if (typeof this.node.name === 'string') {
    return this.node.name;
  } else {
    // @todo handle dynamic variable names
    throw new Error('Dynamic variable names are not supported');
  }
};

module.exports = Variable;
