/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits a generic stateless node
 */
module.exports = function (node, state, output) {
  var properties = [];
  for(var k in node) {
    if (Array.isArray(node[k]) || node[k].kind) {
      properties.push(node[k]);
    }
  }
  this.visit(
    properties,
    state,
    output.append(node.kind, node)
  );
};
