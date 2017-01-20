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
  this.visit(
    node.children,
    state,
    output.append('program')
  );
};
