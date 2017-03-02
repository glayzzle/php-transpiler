/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Parser = require('php-parser');

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
  'method': require('./visitor/function'),
  'return': require('./visitor/return'),
  'doc': require('./visitor/generic'),
  'if': require('./visitor/if'),
  'block': require('./visitor/generic'),
  'call': require('./visitor/call'),
  'for': require('./visitor/for'),
  'pre': require('./visitor/pre'),
  'post': require('./visitor/post'),
  'retif': require('./visitor/retif'),
  'include': require('./visitor/include'),
  'import': require('./visitor/import'),
  'usegroup': require('./visitor/usegroup')
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

  // initialize the parser
  this.parser = new Parser(this.parser || {});
  this.parser.parser.extractDoc = true;
  this.parser.ast.withPositions = true;
  // inject lexing : import * as T_STRING from EXPR;

  // DEFINE A NEW KEYWORD
  this.parser.tokens.values['1000'] = 'T_IMPORT';
  this.parser.tokens.names['T_IMPORT'] = 1000;
  this.parser.lexer.keywords['import'] = 1000;
  this.parser.tokens.values['1001'] = 'T_FROM';
  this.parser.tokens.names['T_FROM'] = 1001;
  this.parser.lexer.keywords['from'] = 1001;

  // DEFINE THE AST NODE
  var Statement = this.parser.ast.statement;
  var KIND = 'import';
  this.parser.ast.import = Statement.extends(function Import(what, where, location) {
    Statement.apply(this, [KIND, location]);
    this.what = what;
    this.where = where;
  });

  // HANDLE THE IMPORT STATEMENT
  var defaultStatement = this.parser.parser.read_statement;
  this.parser.parser.read_statement = function() {
    if (this.token === this.tok.T_IMPORT) {
      var node = this.node('import'), what, where;
      if (this.next().token === '*') {
        this.next().expect(this.tok.T_AS) &&
        this.next().expect(this.tok.T_STRING);
        what = this.text();
        this.next();
      } else if (this.token === '{') {
        what = this.read_list(this.tok.T_STRING, ',');
        this.expect('}') && this.next();
      } else if (this.token === this.tok.T_STRING) {
        what = this.text();
        if (this.next().token === this.tok.T_AS) {
          this.next().expect(this.tok.T_STRING);
          what = [
            [what, this.text()]
          ];
          this.next();
        } else {
          what = [
            [what, what]
          ];
        }
      } else {
        // parse error
        this.expect(['{', '*', this.tok.T_STRING]);
      }
      this.expect(this.tok.T_FROM) && this.next();
      where = this.read_expr();
      this.expectEndOfStatement();
      return node(what, where);
    }
    return defaultStatement.apply(this, arguments);
  }.bind(this.parser.parser);
  this.parser.ast.withPositions = true;
};

/**
 * Reads a code string and returns its transpiled version
 * @param {Object} ast
 * @return {String}
 */
Transpiler.prototype.read = function (code, filename) {
  return this.generate(
    this.parser.parseCode(code, filename)
  );
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
  if (this.browser) {
    state.registerGlobal('console');
    state.registerGlobal('window');
    state.registerGlobal('document');
    state.registerGlobal('jQuery');
    state.registerGlobal('angular');
  }
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
AST.register('return', require('./ast/return'));
AST.register('doc', require('./ast/doc'));
AST.register('if', require('./ast/if'));
AST.register('block', require('./ast/block'));
AST.register('for', require('./ast/for'));
AST.register('generic', require('./ast/generic'));
AST.register('retif', require('./ast/retif'));
AST.register('include', require('./ast/include'));
AST.register('import', require('./ast/import'));

// exports
module.exports = Transpiler;
