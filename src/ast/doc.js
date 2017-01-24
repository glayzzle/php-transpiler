/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Doc
 */
var Doc = AST.extends(function(parent, node) {
  AST.apply(this, [parent]);
  this.node = node;
});

/**
 * Outputs the statement
 */
Doc.prototype.toString = function (indent) {
  if (this.node.isDoc) {
    var body = this.node.lines.join('\n'+indent+' * ');
    if (body.substring(body.length - 3) === ' * ') {
      body = body.substring(0, body.length - 3)
    }
    return indent + '/** ' + body + ' */\n';
  } else {
    return indent + '// ' + this.node.lines.join('\n'+indent+'// ') + '\n';
  }
};

module.exports = Doc;
