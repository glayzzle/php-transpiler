/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the program node
 */
module.exports = function (node, state, output) {
  var main = state.addScope(output.append('program')).node;
  this.visit(node.children, state, main);
  main.functions = state.functions;
  main.classes = state.classes;
};
