/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the namespace node
 */
module.exports = function (node, state, output) {
  // sets the current namespace name
  var prevClass = state.class;
  state.class = node.name;

  // resolves extends
  var extendsClass = node.extends ? state.getClass(
    state.resolve(node.extends, true)
  ) : null;

  // resolves implements
  var implClass = [];
  if (Array.isArray(node.implements)) {
    for(var i = 0; i < node.implements.length; i++) {
      implClass.push(
        state.getClass(
          state.resolve(node.implements[i], true)
        )
      );
    }
  }

  // create a new scope
  var scope = state.addScope(
    output.append(
      'class', {
        name: state.namespace + '\\' + node.name,
        ext: extendsClass,
        impl: implClass,
        node: node
      }
    )
  );

  // parse inner childs
  scope.variable('this');
  this.visit(
    node.body,
    state,
    scope.node
  );

  // pop the state
  state.class = prevClass;
  state.popScope();
};
