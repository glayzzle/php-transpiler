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
var Namespace = AST.extends(function(parent, options) {
  AST.apply(this, [parent]);
  this.name = (options && options.name) || '';
});

/**
 * Outputs the program
 */
Namespace.prototype.toString = function () {
  var buffer = '$php.namespace("' + this.name + '", function($php) {\n';
  buffer += AST.prototype.toString.apply(this, []);
  buffer += '});\n';
  return buffer;
};

module.exports = Namespace;
