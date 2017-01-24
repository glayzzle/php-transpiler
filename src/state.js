/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

// the scope class
var Scope = require('./scope');

var reservedTypes = [
  'self', 'int', 'string',
  'array', 'bool', 'float', 'callable'
];

/**
 * Current parsing state
 * @constructor State
 */
var State = function () {
  this.namespace = '';
  this.uses = {};
  this.scopes = [];
  this.functions = {};
  this.classes = {};
};

/**
 * Registers a function
 */
State.prototype.getFunction = function (name) {
  if (!(name in this.functions)) {
    var lookup = name[0] === '?';
    if (lookup) {
      name = name.substring(1);
    }
    this.functions[name] = {
      name: name,
      cb: '$' + name.replace(/\\/g, '_'),
      lookup: lookup
    };
  }
  return this.functions[name].cb;
};

/**
 * Initialize a new scope
 * @return Scope
 */
State.prototype.addScope = function (node) {
  var scope = new Scope(node);
  this.scopes.push(scope);
  return scope;
};

/**
 * Removes the current scope
 * @return Scope
 */
State.prototype.popScope = function () {
  return this.scopes.pop();
};

/**
 * Gets the current scope
 * @return Scope
 */
State.prototype.scope = function () {
  return this.scopes[this.scopes.length - 1];
};

/**
 * Resolves a name
 * @see http://php.net/manual/en/language.namespaces.rules.php
 */
State.prototype.resolve = function (identifier, asClass) {
  if (identifier.resolution === 'rn') {
    // Relative names always resolve to the name with namespace replaced
    // by the current namespace. If the name occurs in the global namespace,
    // the namespace\ prefix is stripped. For example namespace\A
    // inside namespace X\Y resolves to X\Y\A. The same name inside the
    // global namespace resolves to A.
    return this.namespace + '\\' + identifier.name;
  } else if (identifier.resolution === 'fqn') {
    // Fully qualified names always resolve to the name without
    // leading namespace separator.
    // For instance \A\B resolves to A\B.
    return identifier.name;
  } else if (identifier.resolution === 'uqn') {
    // Unqualified name :
    // 1. search into imports
    if (identifier.name in this.uses) {
      return this.uses[identifier.name].name;
    }
    if (reservedTypes.indexOf(identifier.name) > -1) {
      return identifier.name;
    }
    // 2. is it's a class like prefix with current namespace
    if (asClass) {
      return this.namespace + '\\' + identifier.name;
    }
    // 3. Try to resolve it at runtime
    return '?' + this.namespace + '\\' + identifier.name;
  } else {
    // For qualified names the first segment of the name is translated
    // according to the current class/namespace import table. For example,
    // if the namespace A\B\C is imported as C, the name C\D\E is translated
    // to A\B\C\D\E.
    var parts = identifier.name.split('\\');
    var prefix = parts.shift();
    if (prefix in this.uses) {
      return this.uses[prefix] + '\\' + parts.join('\\');
    }
    // For qualified names, if no import rule applies, the current namespace
    // is prepended to the name. For example, the name C\D\E inside
    // namespace A\B, resolves to A\B\C\D\E.
    return this.namespace + '\\' + identifier.name;
  }
};

// exports
module.exports = State;
