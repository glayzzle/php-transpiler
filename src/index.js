/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

// Output AST manager
var AST = require('./ast');
// Parsing state object
var State = require('./state');
// List generic visitors
var Visitors = {
  'program': require('./visitor/program'),
  'namespace': require('./visitor/namespace'),
  'echo': require('./visitor/echo'),
  'print': require('./visitor/echo'),
  'string': require('./visitor/primitive'),
  'number': require('./visitor/primitive'),
  'boolean': require('./visitor/primitive'),
  'assign': require('./visitor/assign'),
  'variable': require('./visitor/variable'),
  'bin': require('./visitor/bin'),
  'function': require('./visitor/function'),
  'closure': require('./visitor/function'),
  'method': require('./visitor/function')
};

/**
 * Creates a new transpiler instance
 * @constructor Transpiler
 */
var Transpiler = function (options) {
  this.visitors = {};
  // - module : expose as module.exports = function($php) ...
  // - body : expose only the body (used by evals)
  this.mode = 'module';

  // extends with options
  if (options) {
    for(var k in options) {
      this[k] = options;
    }
  }
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
  return output.toString('');
};

/**
 * Static helper
 * @return {String}
 */
Transpiler.generate = function(ast, options) {
  return (new Transpiler(options)).generate(ast);
};

/**
 * Generic node visitor
 * @return void
 */
Transpiler.prototype.visit = function (node, state, output) {
  if (Array.isArray(node)) {
    for(var i = 0; i < node.length; i++) {
      this.visit(node[i], state, output);
    }
  } else {
    var fn = node.kind in this.visitors ? this.visitors[node.kind] : Visitors[node.kind];
    if (typeof fn === 'function') {
      fn.apply(this, [node, state, output]);
    } else {
      output.append('unsupported', node);
    }
  }
};

// registers Javascript serializers
AST.register('program', require('./ast/program'));
AST.register('namespace', require('./ast/namespace'));
AST.register('primitive', require('./ast/primitive'));
AST.register('statement', require('./ast/statement'));
AST.register('call', require('./ast/call'));
AST.register('assign', require('./ast/assign'));
AST.register('variable', require('./ast/variable'));
AST.register('bin', require('./ast/bin'));
AST.register('function', require('./ast/function'));
AST.register('unsupported', require('./ast/unsupported'));

// exports
module.exports = Transpiler;
