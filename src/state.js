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
  this.libraries = {};
};

var LIB_PREFIX = '$_';

/**
 * Inject globals
 */
State.prototype.registerGlobal = function(name) {
  this.libraries[name] = name;
};

/**
 * Inject a list of libraries
 */
State.prototype.setLibrary = function(name) {
  if (typeof name === 'string') {
    this.libraries[name] = LIB_PREFIX + name;
  } else if (Array.isArray(name)) {
    name.forEach(function(item) {
      if (Array.isArray(item)) {
        this.libraries[item[1]] = LIB_PREFIX + item[1];
      } else {
        this.libraries[item] = LIB_PREFIX + item;
      }
    }.bind(this));
  } else {
    for(var k in name) {
      if (name.hasOwnProperty(k)) {
        this.libraries[k] = LIB_PREFIX + k;
      }
    }
  }
  return this;
};

State.prototype.resolveLib = function (name) {
  // check native JS libraries in order to avoid globals
  var libName = name;
  if (libName[0] === '?') {
    libName = libName.substring(1);
  }
  if (libName[0] === '\\') {
    libName = libName.substring(1);
  }
  if (this.namespace.length > 0) {
    if (libName.substring(0, this.namespace.length) === this.namespace) {
      libName = libName.substring(this.namespace.length + 1);
    }
  }
  if(libName in this.libraries) {
    return this.libraries[libName];
  }
};

/**
 * Registers a function
 */
State.prototype.getFunction = function (name) {
  var lib = this.resolveLib(name);
  if (lib) return lib;
  if (!(name in this.functions)) {
    var lookup = name[0] === '?';
    if (lookup) {
      name = name.substring(1);
    }
    this.functions[name] = {
      name: name,
      cb: '$fn_' + name.replace(/\\/g, '_'),
      lookup: lookup
    };
  }
  return this.functions[name].cb;
};

/**
 * Registers a function
 */
State.prototype.getClass = function (name) {
  var lib = this.resolveLib(name);
  if (lib) return lib;
  if (!(name in this.classes)) {
    var lookup = name[0] === '?';
    if (lookup) {
      name = name.substring(1);
    }
    this.classes[name] = {
      name: name,
      cb: '$cls_' + name.replace(/\\/g, '_'),
      lookup: lookup
    };
  }
  return this.classes[name].cb;
};


/**
 * Initialize a new scope
 * @return Scope
 */
State.prototype.addScope = function (node) {
  var scope = new Scope(this, node);
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
      return this.uses[identifier.name];
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
