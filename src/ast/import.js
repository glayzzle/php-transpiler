/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');

/**
 * @constructor AST/Import
 */
var Import = Statement.extends(function(parent, what) {
  Statement.apply(this, [parent]);
  this.what = what;
});

/**
 * Outputs the statement
 */
Import.prototype.toString = function (indent) {

  var req = 'require('+this._nodes[0].toString(indent)+')';
  var buffer = '';
  if (typeof this.what === 'string') {
    buffer = indent + 'var $_' + this.what + ' = ' + req + ';\n';
  } else {
    this.what.forEach(function(item) {
      if(Array.isArray(item)) {
        buffer += indent + 'var $_'+item[1]+' = '+req+'.'+item[0]+';\n';
      } else {
        buffer += indent + 'var $_'+item+' = '+req+'.'+item+';\n';
      }
    });
  }

  return buffer;
};

module.exports = Import;
