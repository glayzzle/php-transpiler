/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');
var Statement = require('./statement');

/**
 * @constructor AST/Property
 */
var Property = Statement.extends(function(parent, node) {
  Statement.apply(this, [parent]);
  this.node = node;
});


/**
 * Outputs the program
 */
Property.prototype.toString = function (indent) {
  var buffer, body = 'null';
  if (this._nodes.length === 1) {
    body = this._nodes[0].toString(indent);
  }
  buffer = indent + '.member(\n';
  buffer += indent + '  '+JSON.stringify(this.node.name)+',\n';
  buffer += indent + '  , ' + body + ')\n';
  if (this.node.isAbstract) {
    buffer += indent + '  .setAbstract()\n';
  }
  if (this.node.isFinal) {
    buffer += indent + '  .setFinal()\n';
  }
  if (this.node.isStatic) {
    buffer += indent + '  .setStatic()\n';
  }
  buffer += indent + '  .setVisibility('+JSON.stringify(this.node.visibility)+').done()\n';
  return buffer;
};

module.exports = Property;
