/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits a (expr)->offset node
 */
module.exports = function (node, state, output) {
  this.visit(
    node.what,
    state,
    output.append('generic', {
      post: function() {
        if (node.offsetkind === 'constref') {
          return '.get(' + this.string(node.offset.name) + ')';
        } else {
          // @todo
          return '[todo]';
        }
      }
    })
  );
};
