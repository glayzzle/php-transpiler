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
  state.scope().variable(node.name);
  output.append('variable', node);
};
