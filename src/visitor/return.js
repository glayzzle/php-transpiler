/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the bin operation
 */
module.exports = function (node, state, output) {
  this.visit(
    node.expr,
    state,
    output.append('return')
  );
};
