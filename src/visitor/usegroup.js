/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the bin operation
 */
module.exports = function (node, state) {
  var prefix = node.name;
  if (prefix) {
    if (prefix.substring(prefix.length - 1) !== '\\') {
      prefix += '\\';
    }
  } else {
    prefix = '';
  }
  node.items.forEach(function(item) {
    state.uses[item.alias] = prefix + item.name;
  });
};
