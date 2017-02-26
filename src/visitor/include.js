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
  var type = node.require ? 'require' : 'include';
  if (node.once) type += '_once';
  this.visit(
    [node.target],
    state,
    output.append('include', type)
  );
};
