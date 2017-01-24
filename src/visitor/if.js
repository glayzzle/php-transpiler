/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits a if node
 */
module.exports = function (node, state, output) {
  var ifNode = output.append('if');
  this.visit(
    [node.test, node.body],
    state,
    ifNode
  );
  if (node.alternate) { // nested elseif parser
    this.visit(
      node.alternate,
      state,
      ifNode
    );
  }
};
