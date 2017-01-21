/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Unsupported
 */
var Unsupported = AST.extends(function(parent, node) {
  AST.apply(this, [parent]);
  this.node = node;
});

/**
 * Outputs the statement
 */
Unsupported.prototype.toString = function (indent) {
  return indent + '// Not supported "' + this.node.kind + '" at line ' + this.node.loc.start.line + ' \n';
};

module.exports = Unsupported;
