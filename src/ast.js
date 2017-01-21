/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

// list of nodes
var astNodes = {};

/**
 * Javascript output nodes
 * @constructor AST
 */
var AST = function (parent) {
  this._parent = parent;
  this._nodes = [];
};

/**
 * Registers a new AST constructor
 */
AST.register = function (name, ctor) {
  astNodes[name] = ctor;
};

/**
 * Extends the AST node
 */
AST.extends = function (ctor) {
  ctor.prototype = Object.create(this.prototype);
  ctor.extends = this.extends;
  ctor.prototype.constructor = ctor;
  return ctor;
};

/**
 * Creates a new node
 */
AST.prototype.append = function (name, options) {
  var node = new astNodes[name](this, options);
  this._nodes.push(node);
  return node;
};

/**
 * Creates a new node
 */
AST.prototype.prepend = function (name, options) {
  var node = new astNodes[name](this, options);
  this._nodes.unshift(node);
  return node;
};

/**
 * Serialize the output
 */
AST.prototype.toString = function (indent) {
  var buffer = '';
  for(var i = 0; i < this._nodes.length; i++) {
    buffer += this._nodes[i].toString(indent);
  }
  return buffer;
};

// exports
module.exports = AST;
