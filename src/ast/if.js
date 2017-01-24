/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');

/**
 * @constructor AST/If
 */
var If = Statement.extends(function(parent) {
  Statement.apply(this, [parent]);
});

/**
 * Outputs the statement
 */
If.prototype.toString = function (indent) {

  var buffer = 'if (' +
     this._nodes[0].toString(indent) +
    ') ' +  this._nodes[1].toString(indent);
  if (this._nodes.length === 3) {
    buffer += indent + 'else ' + this._nodes[2].toString(indent);
  }

  if (this._parent instanceof Statement) {
    return buffer;
  } else {
    return indent + buffer + '\n';
  }

};

module.exports = If;
