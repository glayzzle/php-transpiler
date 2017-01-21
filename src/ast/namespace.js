/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Namespace
 */
var Namespace = AST.extends(function(parent, name) {
  AST.apply(this, [parent]);
  this.name = name;
});

/**
 * Outputs the program
 */
Namespace.prototype.toString = function (indent) {
  var buffer = indent + '$php.context.namespace.declare(\'' + this.name.replace(/\\/g, '\\\\') + '\', function ($php) {\n';
  buffer += AST.prototype.toString.apply(this, [indent + '  ']);
  buffer += indent + '}, $php);\n';
  return buffer;
};

module.exports = Namespace;
