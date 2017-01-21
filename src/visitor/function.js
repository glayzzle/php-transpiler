/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the namespace node
 */
module.exports = function (node, state, output) {
  // sets the current namespace name
  var prevFn = state.function;
  state.function = node.name;
  var scope = state.addScope(output.append('function', node));
  // introduce variables into the scope
  for(var i = 0; i < node.arguments.length; i++) {
    scope.variables[node.arguments[i].name] = {
      from: 'param'
    };
    // resolves the type
    if (node.arguments[i].type) {
      node.arguments[i].type = state.resolve(node.arguments[i].type);
    }
  }
  // introduce variables from previous scope
  if (node.uses && node.uses.length > 0) {
    // introduce variables into the scope
    for(var i = 0; i < node.uses.length; i++) {
      scope.variables[node.uses[i].name] = {
        from: 'use'
      };
    }
  }
  // resolve the return type
  if (node.type) {
    node.type = state.resolve(node.type);
  }
  // parse inner childs
  this.visit(
    node.body.children,
    state,
    scope.node
  );
  state.function = prevFn;
  state.popScope();
};
