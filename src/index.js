/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('./ast');
var State = require('./state');
var Visitors = {
  'program': require('./visitor/program')
};

/**
 * Creates a new transpiler instance
 * @constructor Transpiler
 */
var Transpiler = function (options) {
  this.options = options;
  this.visitors = {};
};

/**
 * Reads AST input (generated from php-parser) and
 * returns a Javascript transcription
 * @param {Object} ast
 * @return {String}
 */
Transpiler.prototype.generate = function (ast) {
  var output = new AST(this);
  var state = new State();
  this.visit(ast, state, output);
  return output.toString();
};

Transpiler.prototype.visit = function (node, state, output) {
  if (Array.isArray(node)) {
    for(var i = 0; i < node.length; i++) {
      this.visit(node[i], state, output);
    }
  } else {
    var fn = node.kind in this.visitors ? this.visitors[node.kind] : Visitors[node.kind];
    fn.apply(this, [node, state, output]);
  }
};

// registers Javascript serializers
AST.register('program', require('./ast/program'));

// exports
module.exports = Transpiler;
