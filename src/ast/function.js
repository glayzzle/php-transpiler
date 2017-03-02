/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');
var Statement = require('./statement');

/**
 * @constructor AST/Function
 */
var fn = AST.extends(function(parent, node) {
  AST.apply(this, [parent]);
  this.node = node;
});

/**
 * Checks the argument typing
 * @see http://php.net/manual/en/functions.arguments.php#functions.arguments.type-declaration
 */
fn.prototype.checkArgumentType = function (nullable, name, type, indent, errTrigger) {
  var checks = [];
  if (nullable) {
    checks.push(indent + 'if (' + name + ' != null) {\n');
    indent += '  ';
  }
  if (type === 'self') {
    checks.push(indent + 'if (!(' + name + ' instanceof this))' + errTrigger);
  } else if (type === 'array') {
    checks.push(indent + 'if (!Array.isArray(' + name + '))' + errTrigger);
  } else if (type === 'callable') {
    // @fixme arrays / strings can also be valid callable
    // http://php.net/manual/en/language.types.callable.php
    checks.push(indent + 'if (typeof ' + name + ' !== \'function\')' + errTrigger);
  } else if (type === 'bool') {
    checks.push(indent + 'if (typeof ' + name + ' !== \'boolean\' && !(' + name + ' instanceof Boolean))' + errTrigger);
  } else if (type === 'float') {
    checks.push(indent + 'if (typeof ' + name + ' !== \'number\' || ' + name + ' % 1 === 0)' + errTrigger);
  } else if (type === 'int') {
    checks.push(indent + 'if (typeof ' + name + ' !== \'number\' || ' + name + ' % 1 !== 0)' + errTrigger);
  } else if (type === 'string') {
    checks.push(indent + 'if (typeof ' + name + ' !== \'string\' && !(' + name + ' instanceof String))' + errTrigger);
  } else {
    // check the class
    checks.push(indent + 'if (!' + name + '.is(\'' + type + '\'))' + errTrigger);
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
fn.prototype.toString = function (indent) {
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
  var typeChecks = [];
  var defaultChecks = [];
  var argsReflection = [];
  indent += '  ';

  for(var i = 0; i < this.node.arguments.length; i++) {
    var arg = this.node.arguments[i];
    parameters.push(arg.name);
    var argItem = { name: arg.name };
    if (!arg.variadic) {
      if (arg.type) {
        argItem.type = arg.type;
        typeChecks = typeChecks.concat(
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
        argItem.default = arg.value;
        // @todo sets a default value if not defined
        defaultChecks.push(indent + 'if (typeof ' + arg.name + ' === \'undefined\') ' + arg.name + ' = null;\n');
      }
    } else {
      // handle variadic arguments
      defaultChecks.push(
        indent + arg.name + ' = Array.prototype.slice.call(arguments, ' + i + ');'
      );
      if (arg.type) {
        // check each variadic argument
        typeChecks.push(indent + 'for(var $i = 0; $i < ' + arg.name + '.length; $i++) {\n');
        typeChecks = typeChecks.concat(
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
        typeChecks.push(indent + '}');
      }
    }
    argsReflection.push(argItem);
  }

  // function body
  buffer += parameters.join(', ') + ') {\n';
  if (defaultChecks.length > 0) {
    buffer += defaultChecks.join('\n') + '\n';
  }
  if (typeChecks.length > 0) {
    buffer += indent + 'if ($php.context.strictTypes) {\n';
    buffer += '  ' + typeChecks.join('\n  ') + '\n';
    buffer += indent + '}\n';
  }
  buffer += this.variablesToString(indent);
  var returnType = 'null';
  if (this.node.type) {
    returnType = '\''+this.node.type+'\'';
    buffer += indent + 'do {\n';
    buffer += AST.prototype.toString.apply(this, [indent + '  ']);
    buffer += indent + '} while(false);\n';
    buffer += indent + 'if ($php.context.strictTypes) {\n';
    buffer += '  ' + this.checkArgumentType(
      this.node.nullable,
      '$result',
      this.node.type,
      indent,
      ' $php.type_error(-1, null, \'' + name + '\', \'' + this.node.type + '\', $result);'
    ).join('\n  ') + '\n' + indent + '}\n';
  } else {
    buffer += AST.prototype.toString.apply(this, [indent]);
  }
  buffer += indent + 'return $result;\n';
  indent = indent.substring(0, indent.length - 2);
  buffer += indent + '}';

  // encapsulate
  if (this.node.kind === 'function') {
    // global function
    var body = buffer;
    buffer = indent + '$php.context.function.declare(\n';
    buffer += indent + '  \''+this.node.name+'\',\n';
    buffer += indent + '  '+JSON.stringify(argsReflection)+',\n';
    buffer += indent + '  '+returnType+', ' + body + ');\n';
  } else if (this.node.kind === 'method') {
    // @todo method declaration
  } else if (!(this._parent instanceof Statement)) {
    buffer = indent + buffer + ';\n';
  }
  return buffer;
};

module.exports = fn;
