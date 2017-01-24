/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Block
 */
var Block = AST.extends(function(parent) {
  AST.apply(this, [parent]);
});

/**
 * Outputs the statement
 */
Block.prototype.toString = function (indent) {
  return '{\n' +
    AST.prototype.toString.apply(this, [indent + '  ']) +
  indent + '}\n';
};

module.exports = Block;
