/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Current scope
 * @constructor Scope
 */
var Scope = function (state, node) {
  this.state = state;
  this.node = node;
  this.node.scope = this;
  this.variables = {};
};

/**
 * Sets a variable into the current scope
 */
Scope.prototype.variable = function(name) {
  if (name in this.state.libraries) {
    return this;
  }
  if (typeof name === 'string') {
    if (!(name in this.variables)) {
      this.variables[name] = {
        from: 'scope'
      };
    }
  } else {
    // @todo handle in another way dynamic variable names
  }
  return this;
};

// exports
module.exports = Scope;
