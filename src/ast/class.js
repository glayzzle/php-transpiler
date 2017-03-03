/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');
var Statement = require('./statement');

/**
 * @constructor AST/Class
 */
var Class = AST.extends(function(parent, opt) {
  AST.apply(this, [parent]);
  this.name = opt.name;
  this.ext = opt.ext;
  this.impl = opt.impl;
  this.node = opt.node;
});

/**
 * Outputs the program
 */
Class.prototype.toString = function (indent) {
  var buffer = '';

  buffer += indent + '$php.context.class.declare('+JSON.stringify(this.name)+')\n';
  var inner = indent + '  ';
  if (this.node.isFinal) {
    buffer += inner + '.final()\n';
  }
  if (this.node.isAbstract) {
    buffer += inner + '.abstract()\n';
  }
  if (this.ext) {
    buffer += inner + '.extends('+this.ext+')\n';
  }
  if (this.impl && this.impl.length > 0) {
    for(var i = 0; i < this.impl.length; i++) {
      buffer += inner + '.implements('+this.impl[i]+')\n';
    }
  }
  buffer += AST.prototype.toString.apply(this, [inner]);
  buffer += indent + ';\n';
  return buffer;
};

module.exports = Class;
