/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits a ++(expr) node
 */
module.exports = function (node, state, output) {
  this.visit(
    node.what,
    state,
    output.append('generic', {
      pre: function() {
        return node.type + node.type;
      }
    })
  );
};
