/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Call
 */
var Call = AST.extends(function(parent, what) {
  AST.apply(this, [parent]);
  this.what = what || '';
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
  return this.what + ' (' + args.join(', ') + ')';
};

module.exports = Call;
