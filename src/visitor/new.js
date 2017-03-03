/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits an encapsed string
 */
module.exports = function (node, state, output) {
  if (node.what.kind !== 'identifier') {
    throw new Error('Bad node type for new statement');
  }
  var clsName = state.getClass(
    state.resolve(node.what, true)
  );
  this.visit(
    node.arguments,
    state,
    output.append('new', clsName)
  );
};
