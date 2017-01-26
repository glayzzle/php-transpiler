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
  ctor.prototype = new this();
  ctor.prototype.constructor = ctor;
  ctor.extends = this.extends.bind(ctor);
  return ctor;
};

/**
 * Registers a new AST constructor
 */
AST.prototype.transpiler = function () {
  if (!(this._parent instanceof AST)) {
    return this._parent;
  } else if (this._parent) {
    return this._parent.transpiler();
  }
};

/**
 * Scans for a specific parent instance
 */
AST.prototype.parent = function (type) {
  var parent = this._parent;
  while(!(parent instanceof type)) {
    parent = parent._parent;
    if (!parent) break;
  }
  return parent;
};

/**
 * Serialize the specified string value
 */
AST.prototype.string = function (value) {
  return '\'' + value.replace(/\\/g, '\\\\')  + '\'';
};

/**
 * Creates a new node
 */
AST.prototype.create = function (name, options) {
  if (!(name in astNodes)) {
    throw new Error('Undefined node ' + name)
  }
  return new astNodes[name](this, options);
};

/**
 * Creates a new node
 */
AST.prototype.append = function (name, options) {
  var node = this.create(name, options);
  this._nodes.push(node);
  return node;
};

/**
 * Creates a new node
 */
AST.prototype.prepend = function (name, options) {
  var node = this.create(name, options);
  this._nodes.unshift(node);
  return node;
};

/**
 * Serialize the output
 */
AST.prototype.variablesToString = function (indent) {
  var buffer = '';
  if (this.scope && this.scope.variables) {
    for(var n in this.scope.variables) {
      if (this.scope.variables[n].from === 'scope') {
        buffer += indent + 'var ' + n + ';\n';
      }
    }
  }
  if (buffer.length > 0) {
    buffer = '\n' + indent + '// variables into current scope\n' + buffer;
  }
  return buffer;
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
