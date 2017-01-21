/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Function
 */
var Function = AST.extends(function(parent, node) {
  AST.apply(this, [parent]);
  this.node = node;
});

/**
 * Checks the argument typing
 * @see http://php.net/manual/en/functions.arguments.php#functions.arguments.type-declaration
 */
Function.prototype.checkArgumentType = function (nullable, name, type, indent, errTrigger) {
  var checks = [];
  if (nullable) {
    checks.push(indent + 'if(' + name + ' != null) {\n');
    indent += '  ';
  }
  if (type === 'self') {
    checks.push(indent + 'if(!(' + name + ' instanceof this))' + errTrigger);
  } else if (type === 'array') {
    checks.push(indent + 'if(!Array.isArray(' + name + '))' + errTrigger);
  } else if (type === 'callable') {
    // @fixme arrays / strings can also be valid callable
    // http://php.net/manual/en/language.types.callable.php
    checks.push(indent + 'if(typeof ' + name + ' !== \'function\')' + errTrigger);
  } else if (type === 'bool') {
    checks.push(indent + 'if(typeof ' + name + ' !== \'boolean\' && !(' + name + ' instanceof Boolean))' + errTrigger);
  } else if (type === 'float') {
    checks.push(indent + 'if(typeof ' + name + ' !== \'number\' || ' + name + ' % 1 === 0)' + errTrigger);
  } else if (type === 'int') {
    checks.push(indent + 'if(typeof ' + name + ' !== \'number\' || ' + name + ' % 1 !== 0)' + errTrigger);
  } else if (type === 'string') {
    checks.push(indent + 'if(typeof ' + name + ' !== \'string\' && !(' + name + ' instanceof String))' + errTrigger);
  } else {
    // check the class
    checks.push(indent + 'if(!' + name + '.is(\'' + type + '\'))' + errTrigger);
  }
  if (nullable) {
    indent = indent.substring(0, indent.length - 2);
    checks.push(indent + '}\n');
  }
  return checks;
};

/**
 * Outputs the program
 */
Function.prototype.toString = function (indent) {
  var buffer;
  var name = this.node.name;
  if (this.node.kind === 'closure') {
    // closure
    buffer = 'function (';
    name = '#closure';
  } else {
    buffer = 'function ' + name + ' (';
  }

  // arguments
  var parameters = [];
  var checks = [];
  indent += '  ';

  for(var i = 0; i < this.node.arguments.length; i++) {
    var arg = this.node.arguments[i];
    parameters.push(arg.name);
    if (!arg.variadic) {
      if (arg.type) {
        checks = checks.concat(
          this.checkArgumentType(
            arg.nullable || (
              arg.value && arg.value.kind === 'constref' &&
              arg.value.name.resolution === 'uqn' &&
              arg.value.name.name === 'null'
            ),
            arg.name,
            arg.type,
            indent,
            ' $php.type_error(' + i + ', \'' + arg.name + '\', \'' + name + '\', \'' + arg.type + '\', ' + arg.name + ');'
          )
        );
      }
      if (arg.value) {
        // @todo sets a default value if not defined
        checks.push(indent + 'if (typeof ' + arg.name + ' === \'undefined\') ' + arg.name + ' = null;\n');
      }
    } else {
      // handle variadic arguments
      checks.push(
        indent + arg.name + ' = Array.prototype.slice.call(arguments, ' + i + ');'
      );
      if (arg.type) {
        // check each variadic argument
        checks.push(indent + 'for(var $i = 0; $i < ' + arg.name + '.length; $i++) {\n');
        checks = checks.concat(
          this.checkArgumentType(
            arg.nullable || (
              arg.value && arg.value.kind === 'constref' &&
              arg.value.name.resolution === 'uqn' &&
              arg.value.name.name === 'null'
            ),
            arg.name + '[$i]',
            arg.type,
            indent + '  ',
            ' $php.type_error(' + i + ', \'' + arg.name + '\', \'' + name + '\', \'' + arg.type + '\', ' + arg.name + ');'
          )
        );
        checks.push(indent + '}');
      }
    }
  }

  // function body
  buffer += parameters.join(', ') + ') {\n';
  buffer += checks.join('\n');
  buffer += this.variablesToString(indent);
  if (this.node.type) {
    buffer += indent + 'var $result = (function() {\n';
    buffer += AST.prototype.toString.apply(this, [indent + '  ']);
    buffer += indent + '})();';
    buffer = this.checkArgumentType(
      this.node.nullable,
      '$result',
      this.node.type,
      indent,
      ' $php.type_error(-1, null, \'' + name + '\', \'' + this.node.type + '\', $result);'
    ).join('\n');
    buffer += indent + 'return $result;';
  } else {
    buffer += AST.prototype.toString.apply(this, [indent]);
  }
  indent = indent.substring(0, indent.length - 2);
  buffer += indent + '}';

  // encapsulate
  if (this.node.kind === 'function') {
    // global function
    buffer = indent + '$php.context.function.declare(\''+this.node.name+'\', ' + buffer + ');\n'
  } else if (this.node.kind === 'method') {
    // @todo method declaration
  } else if (!(this._parent instanceof Statement)) {
    buffer = indent + buffer + ';\n';
  }
  return buffer;
};

module.exports = Function;
