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
  var fnName;
  if (node.what.kind === 'identifier') {
    fnName = state.getFunction(
      state.resolve(node.what, false)
    );
  } else if (node.what.kind === 'staticlookup') {
    fnName = state.getClass(
      state.resolve(node.what.what, false)
    );
    if (node.what.offset.kind === 'constref') {
      fnName += '.' + node.what.offset.name;
    } else {
      throw new Error(
        'Unable to handle call offset from ' +
        node.what.offset.kind
      );
    }
  } else if (node.what.kind === 'propertylookup') {
    state.scope().variable(node.what.what.name);
    fnName = node.what.what.name;
    if (node.what.offset.kind === 'constref') {
      fnName += '.' + node.what.offset.name;
    } else {
      throw new Error(
        'Unable to handle call offset from ' +
        node.what.offset.kind
      );
    }
  } else {
    console.log(node.what);
    throw new Error(
      'Unable to handle calls from ' +
      node.what.kind
    );
  }
  this.visit(
    node.arguments,
    state,
    output.append('call', fnName)
  );
};
