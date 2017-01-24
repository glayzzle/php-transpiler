/*! php-transpiler - BSD3 License - 2017-01-24 */

require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

// list of nodes
var astNodes = {};

/**
 * Javascript output nodes
 * @constructor AST
 */
var AST = function (parent) {
  this._parent = parent;
  this._nodes = [];
};

/**
 * Registers a new AST constructor
 */
AST.register = function (name, ctor) {
  astNodes[name] = ctor;
};

/**
 * Extends the AST node
 */
AST.extends = function (ctor) {
  ctor.prototype = new this();
  ctor.prototype.constructor = ctor;
  ctor.extends = this.extends.bind(ctor);
  return ctor;
};

/**
 * Registers a new AST constructor
 */
AST.prototype.transpiler = function () {
  if (!(this._parent instanceof AST)) {
    return this._parent;
  } else if (this._parent) {
    return this._parent.transpiler();
  }
};

/**
 * Creates a new node
 */
AST.prototype.create = function (name, options) {
  if (!(name in astNodes)) {
    throw new Error('Undefined node ' + name)
  }
  return new astNodes[name](this, options);
};

/**
 * Creates a new node
 */
AST.prototype.append = function (name, options) {
  var node = this.create(name, options);
  this._nodes.push(node);
  return node;
};

/**
 * Creates a new node
 */
AST.prototype.prepend = function (name, options) {
  var node = this.create(name, options);
  this._nodes.unshift(node);
  return node;
};

/**
 * Serialize the output
 */
AST.prototype.variablesToString = function (indent) {
  var buffer = '';
  if (this.scope && this.scope.variables) {
    for(var n in this.scope.variables) {
      if (this.scope.variables[n].from === 'scope') {
        buffer += indent + 'var ' + n + ';\n';
      }
    }
  }
  if (buffer.length > 0) {
    buffer = '\n' + indent + '// variables into current scope\n' + buffer;
  }
  return buffer;
};

/**
 * Serialize the output
 */
AST.prototype.toString = function (indent) {
  var buffer = '';
  for(var i = 0; i < this._nodes.length; i++) {
    buffer += this._nodes[i].toString(indent);
  }
  return buffer;
};

// exports
module.exports = AST;

},{}],2:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');

/**
 * @constructor AST/Assign
 */
var Assign = Statement.extends(function(parent, operator) {
  Statement.apply(this, [parent]);
  this.operator = operator || '=';
});

/**
 * Outputs the statement
 */
Assign.prototype.toString = function (indent) {
  // @todo handle operators like <=> or <<= or >>=
  if (this._nodes.length === 2) {
    var buffer = this._nodes[0].toString(indent) + ' ' + this.operator + ' ' + this._nodes[1].toString(indent);
    if (this._parent instanceof Statement) {
      return buffer;
    } else {
      return indent + buffer + ';\n';
    }
  } else {
    throw new Error('Assign statement expects a left and right nodes');
  }
};

module.exports = Assign;

},{"./statement":13}],3:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');

/**
 * @constructor AST/Bin
 */
var Bin = Statement.extends(function(parent, type) {
  Statement.apply(this, [parent]);
  this.type = type || '+';
});

/**
 * Outputs the statement
 */
Bin.prototype.toString = function (indent) {
  // @todo handle operators like << or >>
  if (this._nodes.length === 2) {
    var buffer = this._nodes[0].toString(indent) + ' ' + this.type + ' ' + this._nodes[1].toString(indent);
    if (this._parent instanceof Statement) {
      return buffer;
    } else {
      return indent + buffer + ';\n';
    }
  } else {
    throw new Error('Binary expression expects a left and right nodes');
  }
};

module.exports = Bin;

},{"./statement":13}],4:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Block
 */
var Block = AST.extends(function(parent) {
  AST.apply(this, [parent]);
});

/**
 * Outputs the statement
 */
Block.prototype.toString = function (indent) {
  return '{\n' +
    AST.prototype.toString.apply(this, [indent + '  ']) +
  indent + '}\n';
};

module.exports = Block;

},{"../ast":1}],5:[function(require,module,exports){
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
    return indent + buffer + '\n';
  }
};

module.exports = Call;

},{"./statement":13}],6:[function(require,module,exports){
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

},{"../ast":1}],7:[function(require,module,exports){
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
  if (checks.length > 0) {
    buffer += checks.join('\n') + '\n';
  }
  buffer += this.variablesToString(indent);
  if (this.node.type) {
    buffer += indent + 'var $result = (function() {\n';
    buffer += AST.prototype.toString.apply(this, [indent + '  ']);
    buffer += indent + '})();\n';
    buffer += this.checkArgumentType(
      this.node.nullable,
      '$result',
      this.node.type,
      indent,
      ' $php.type_error(-1, null, \'' + name + '\', \'' + this.node.type + '\', $result);'
    ).join('\n');
    buffer += '\n' + indent + 'return $result;\n';
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

module.exports = fn;

},{"../ast":1}],8:[function(require,module,exports){
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

},{"./statement":13}],9:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Namespace
 */
var Namespace = AST.extends(function(parent, name) {
  AST.apply(this, [parent]);
  this.name = name;
});

/**
 * Outputs the program
 */
Namespace.prototype.toString = function (indent) {
  var buffer = indent + '$php.context.namespace.declare(\'' + this.name.replace(/\\/g, '\\\\') + '\', function ($php) {\n';
  buffer += AST.prototype.toString.apply(this, [indent + '  ']);
  buffer += indent + '}, $php);\n';
  return buffer;
};

module.exports = Namespace;

},{"../ast":1}],10:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Primitive
 */
var Primitive = AST.extends(function(parent, node) {
  AST.apply(this, [parent]);
  this.node = node;
});

/**
 * Outputs the primitive
 */
Primitive.prototype.toString = function () {
  if (this.node.kind === 'string') {
    return '\'' + this.node.value
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/'/g, '\\\'')
      + '\'';
  } else if (this.node.kind === 'number') {
    return this.node.value;
  } else if (this.node.kind === 'boolean') {
    return this.node.value ? 'true' : 'false';
  }
  throw new Error('Undefined primitive type : ' + this.node.kind);
};

module.exports = Primitive;

},{"../ast":1}],11:[function(require,module,exports){
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

},{"../ast":1}],12:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Statement = require('./statement');
var AST = require('../ast');

/**
 * @constructor AST/Return
 */
var Return = Statement.extends(function(parent) {
  Statement.apply(this, [parent]);
});

/**
 * Outputs the statement
 */
Return.prototype.toString = function (indent) {
  var buffer = 'return ';
  buffer += AST.prototype.toString.apply(this, [indent]);
  if (this._parent instanceof Statement) {
    return buffer;
  } else {
    return indent + buffer + ';\n';
  }
};

module.exports = Return;

},{"../ast":1,"./statement":13}],13:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Statement
 */
var Statement = AST.extends(function(parent) {
  AST.apply(this, [parent]);
});

/**
 * Outputs the statement
 */
Statement.prototype.toString = function (indent) {
  var buffer = '';
  for(var i = 0; i < this._nodes.length; i++) {
    buffer += indent + this._nodes[i].toString(indent) + ';\n';
  }
  return buffer;
};

module.exports = Statement;

},{"../ast":1}],14:[function(require,module,exports){
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

},{"../ast":1}],15:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var AST = require('../ast');

/**
 * @constructor AST/Variable
 */
var Variable = AST.extends(function(parent, node) {
  AST.apply(this, [parent]);
  this.node = node;
});

/**
 * Outputs the variable
 */
Variable.prototype.toString = function () {
  // @todo handle byref
  if (typeof this.node.name === 'string') {
    return this.node.name;
  } else {
    // @todo handle dynamic variable names
    throw new Error('Dynamic variable names are not supported');
  }
};

module.exports = Variable;

},{"../ast":1}],16:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Current scope
 * @constructor Scope
 */
var Scope = function (node) {
  this.node = node;
  this.node.scope = this;
  this.variables = {};
};

/**
 * Sets a variable into the current scope
 */
Scope.prototype.variable = function(name) {
  if (typeof name === 'string') {
    if (!(name in this.variables)) {
      this.variables[name] = {
        from: 'scope'
      };
    }
  } else {
    // @todo handle in another way dynamic variable names
  }
  return this;
};

// exports
module.exports = Scope;

},{}],17:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

// the scope class
var Scope = require('./scope');

var reservedTypes = [
  'self', 'int', 'string',
  'array', 'bool', 'float', 'callable'
];

/**
 * Current parsing state
 * @constructor State
 */
var State = function () {
  this.namespace = '';
  this.uses = {};
  this.scopes = [];
  this.functions = {};
  this.classes = {};
};

/**
 * Registers a function
 */
State.prototype.getFunction = function (name) {
  if (!(name in this.functions)) {
    var lookup = name[0] === '?';
    if (lookup) {
      name = name.substring(1);
    }
    this.functions[name] = {
      name: name,
      cb: '$fn_' + name.replace(/\\/g, '_'),
      lookup: lookup
    };
  }
  return this.functions[name].cb;
};

/**
 * Initialize a new scope
 * @return Scope
 */
State.prototype.addScope = function (node) {
  var scope = new Scope(node);
  this.scopes.push(scope);
  return scope;
};

/**
 * Removes the current scope
 * @return Scope
 */
State.prototype.popScope = function () {
  return this.scopes.pop();
};

/**
 * Gets the current scope
 * @return Scope
 */
State.prototype.scope = function () {
  return this.scopes[this.scopes.length - 1];
};

/**
 * Resolves a name
 * @see http://php.net/manual/en/language.namespaces.rules.php
 */
State.prototype.resolve = function (identifier, asClass) {
  if (identifier.resolution === 'rn') {
    // Relative names always resolve to the name with namespace replaced
    // by the current namespace. If the name occurs in the global namespace,
    // the namespace\ prefix is stripped. For example namespace\A
    // inside namespace X\Y resolves to X\Y\A. The same name inside the
    // global namespace resolves to A.
    return this.namespace + '\\' + identifier.name;
  } else if (identifier.resolution === 'fqn') {
    // Fully qualified names always resolve to the name without
    // leading namespace separator.
    // For instance \A\B resolves to A\B.
    return identifier.name;
  } else if (identifier.resolution === 'uqn') {
    // Unqualified name :
    // 1. search into imports
    if (identifier.name in this.uses) {
      return this.uses[identifier.name].name;
    }
    if (reservedTypes.indexOf(identifier.name) > -1) {
      return identifier.name;
    }
    // 2. is it's a class like prefix with current namespace
    if (asClass) {
      return this.namespace + '\\' + identifier.name;
    }
    // 3. Try to resolve it at runtime
    return '?' + this.namespace + '\\' + identifier.name;
  } else {
    // For qualified names the first segment of the name is translated
    // according to the current class/namespace import table. For example,
    // if the namespace A\B\C is imported as C, the name C\D\E is translated
    // to A\B\C\D\E.
    var parts = identifier.name.split('\\');
    var prefix = parts.shift();
    if (prefix in this.uses) {
      return this.uses[prefix] + '\\' + parts.join('\\');
    }
    // For qualified names, if no import rule applies, the current namespace
    // is prepended to the name. For example, the name C\D\E inside
    // namespace A\B, resolves to A\B\C\D\E.
    return this.namespace + '\\' + identifier.name;
  }
};

// exports
module.exports = State;

},{"./scope":16}],18:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the assign statement
 */
module.exports = function (node, state, output) {
  this.visit(
    [node.left, node.right],
    state,
    output.append('assign', node.operator)
  );
};

},{}],19:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the bin operation
 */
module.exports = function (node, state, output) {
  this.visit(
    [node.left, node.right],
    state,
    output.append('bin', node.type)
  );
};

},{}],20:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the echo/print node
 */
module.exports = function (node, state, output) {
  var fnName = state.getFunction(
    state.resolve(node.what, false)
  );
  this.visit(
    node.arguments,
    state,
    output.append('call', fnName)
  );
};

},{}],21:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the echo/print node
 */
module.exports = function (node, state, output) {
  this.visit(
    node.arguments,
    state,
    output.append('statement').append('call', '$php.stdout.print')
  );
};

},{}],22:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the namespace node
 */
module.exports = function (node, state, output) {
  // sets the current namespace name
  var prevFn = state.function;
  state.function = node.name;
  var scope = state.addScope(output.append('function', node));
  // introduce variables into the scope
  for(var i = 0; i < node.arguments.length; i++) {
    scope.variables[node.arguments[i].name] = {
      from: 'param'
    };
    // resolves the type
    if (node.arguments[i].type) {
      node.arguments[i].type = state.resolve(node.arguments[i].type);
    }
  }
  // introduce variables from previous scope
  if (node.uses && node.uses.length > 0) {
    // introduce variables into the scope
    for(var i = 0; i < node.uses.length; i++) {
      scope.variables[node.uses[i].name] = {
        from: 'use'
      };
    }
  }
  // resolve the return type
  if (node.type) {
    node.type = state.resolve(node.type);
  }
  // parse inner childs
  this.visit(
    node.body.children,
    state,
    scope.node
  );
  state.function = prevFn;
  state.popScope();
};

},{}],23:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits a generic stateless node
 */
module.exports = function (node, state, output) {
  var properties = [];
  for(var k in node) {
    if (Array.isArray(node[k]) || node[k].kind) {
      properties.push(node[k]);
    }
  }
  this.visit(
    properties,
    state,
    output.append(node.kind, node)
  );
};

},{}],24:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits a if node
 */
module.exports = function (node, state, output) {
  var ifNode = output.append('if');
  this.visit(
    [node.test, node.body],
    state,
    ifNode
  );
  if (node.alternate) { // nested elseif parser
    this.visit(
      node.alternate,
      state,
      ifNode
    );
  }
};

},{}],25:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the namespace node
 */
module.exports = function (node, state, output) {
  // sets the current namespace name
  var previousNamespace = state.namespace;
  state.namespace = node.name.name;
  // parse inner childs
  this.visit(
    node.children,
    state,
    output.append('namespace', node.name.name)
  );
  state.namespace = previousNamespace;
};

},{}],26:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits a primitive
 */
module.exports = function (node, state, output) {
  output.append('primitive', node);
};

},{}],27:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the program node
 */
module.exports = function (node, state, output) {
  var main = state.addScope(output.append('program')).node;
  this.visit(node.children, state, main);
  main.functions = state.functions;
  main.classes = state.classes;
};

},{}],28:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the bin operation
 */
module.exports = function (node, state, output) {
  this.visit(
    node.expr,
    state,
    output.append('return')
  );
};

},{}],29:[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Visits the echo/print node
 */
module.exports = function (node, state, output) {
  state.scope().variable(node.name);
  output.append('variable', node);
};

},{}],"php-transpiler":[function(require,module,exports){
/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

// Output AST manager
var AST = require('./ast');
// Parsing state object
var State = require('./state');
// List generic visitors
var Visitors = {
  'program': require('./visitor/program'),
  'namespace': require('./visitor/namespace'),
  'echo': require('./visitor/echo'),
  'print': require('./visitor/echo'),
  'string': require('./visitor/primitive'),
  'number': require('./visitor/primitive'),
  'boolean': require('./visitor/primitive'),
  'assign': require('./visitor/assign'),
  'variable': require('./visitor/variable'),
  'bin': require('./visitor/bin'),
  'function': require('./visitor/function'),
  'closure': require('./visitor/function'),
  'method': require('./visitor/function'),
  'return': require('./visitor/return'),
  'doc': require('./visitor/generic'),
  'if': require('./visitor/if'),
  'block': require('./visitor/generic'),
  'call': require('./visitor/call')
};

/**
 * Creates a new transpiler instance
 * @constructor Transpiler
 */
var Transpiler = function (options) {
  this.visitors = {};
  // - module : expose as module.exports = function($php) ...
  // - body : expose only the body (used by evals)
  this.mode = 'module';

  // extends with options
  if (options) {
    for(var k in options) {
      this[k] = options;
    }
  }
};

/**
 * Reads AST input (generated from php-parser) and
 * returns a Javascript transcription
 * @param {Object} ast
 * @return {String}
 */
Transpiler.prototype.generate = function (ast) {
  var output = new AST(this);
  var state = new State();
  this.visit(ast, state, output);
  return output.toString('');
};

/**
 * Static helper
 * @return {String}
 */
Transpiler.generate = function(ast, options) {
  return (new Transpiler(options)).generate(ast);
};

/**
 * Generic node visitor
 * @return void
 */
Transpiler.prototype.visit = function (node, state, output) {
  if (Array.isArray(node)) {
    for(var i = 0; i < node.length; i++) {
      this.visit(node[i], state, output);
    }
  } else {
    var fn = node.kind in this.visitors ? this.visitors[node.kind] : Visitors[node.kind];
    if (typeof fn === 'function') {
      fn.apply(this, [node, state, output]);
    } else {
      output.append('unsupported', node);
    }
  }
};

// registers Javascript serializers
AST.register('program', require('./ast/program'));
AST.register('namespace', require('./ast/namespace'));
AST.register('primitive', require('./ast/primitive'));
AST.register('statement', require('./ast/statement'));
AST.register('call', require('./ast/call'));
AST.register('assign', require('./ast/assign'));
AST.register('variable', require('./ast/variable'));
AST.register('bin', require('./ast/bin'));
AST.register('function', require('./ast/function'));
AST.register('unsupported', require('./ast/unsupported'));
AST.register('return', require('./ast/return'));
AST.register('doc', require('./ast/doc'));
AST.register('if', require('./ast/if'));
AST.register('block', require('./ast/block'));

// exports
module.exports = Transpiler;

},{"./ast":1,"./ast/assign":2,"./ast/bin":3,"./ast/block":4,"./ast/call":5,"./ast/doc":6,"./ast/function":7,"./ast/if":8,"./ast/namespace":9,"./ast/primitive":10,"./ast/program":11,"./ast/return":12,"./ast/statement":13,"./ast/unsupported":14,"./ast/variable":15,"./state":17,"./visitor/assign":18,"./visitor/bin":19,"./visitor/call":20,"./visitor/echo":21,"./visitor/function":22,"./visitor/generic":23,"./visitor/if":24,"./visitor/namespace":25,"./visitor/primitive":26,"./visitor/program":27,"./visitor/return":28,"./visitor/variable":29}]},{},[]);
