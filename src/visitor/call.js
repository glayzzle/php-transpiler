/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the echo/print node
 */
module.exports = function (node, state, output) {
  var fnName = state.getFunction(
    state.resolve(node.what, false)
  );
  this.visit(
    node.arguments,
    state,
    output.append('call', fnName)
  );
};
