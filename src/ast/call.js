/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');

/**
 * @constructor AST/Call
 */
var Call = Statement.extends(function(parent, what) {
  Statement.apply(this, [parent]);
  this.what = what;
});

/**
 * Outputs the statement
 */
Call.prototype.toString = function (indent) {
  var args = [];
  for(var i = 0; i < this._nodes.length; i++) {
    args.push(
      this._nodes[i].toString(indent)
    );
  }
  var buffer = this.what + ' (' + args.join(', ') + ')';
  if (this._parent instanceof Statement) {
    return buffer;
  } else {
    return indent + buffer + ';\n';
  }
};

module.exports = Call;
