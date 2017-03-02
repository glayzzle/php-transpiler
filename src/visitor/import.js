/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the import node
 */
module.exports = function (node, state, output) {
  // adds a new library import
  this.visit(
    node.where,
    state.setLibrary(node.what),
    output.append('import', node.what)
  );
};
