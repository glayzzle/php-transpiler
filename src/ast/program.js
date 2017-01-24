/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Program
 */
var Program = AST.extends(function(parent) {
  AST.apply(this, [parent]);
});

/**
 * Outputs the program
 */
Program.prototype.toString = function (indent) {
  var buffer;
  var isModule = this.transpiler().mode === 'module';
  if (isModule) {
    buffer = '/**' +
      '\n * GLAYZZLE GENERATED FILE' +
      '\n * @date ' + (new Date()).toString() +
      '\n * @see https://github.com/glayzzle/php-transpiler' +
      '\n */\n'
    ;
    buffer += 'module.exports = function($php) {\n';
    indent += '  ';
  } else {
    buffer = '';
  }

  var fnBuffer = '';
  for(var n in this.functions) {
    var fn = this.functions[n];
    fnBuffer += indent + 'var ' + fn.cb + ' = $php.context.function.get(\''+fn.name+'\', '+(
      fn.lookup ? 'true': 'false'
    )+');\n';
  }
  if (fnBuffer.length > 0) {
    buffer += indent + '// function imports\n' + fnBuffer;
  }

  buffer += this.variablesToString(indent);
  buffer += AST.prototype.toString.apply(this, [indent]);
  if (isModule) {
    buffer += '};\n';
  }
  return buffer;
};

module.exports = Program;
