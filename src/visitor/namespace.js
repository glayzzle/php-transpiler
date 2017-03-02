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
  var previousNamespace = state.namespace;
  var previousUses = state.uses;
  state.namespace = node.name;
  state.uses = {};
  // parse inner childs
  this.visit(
    node.children,
    state,
    output.append('namespace', node.name)
  );
  state.namespace = previousNamespace;
  state.uses = previousUses;
};
