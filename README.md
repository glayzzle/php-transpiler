# php-transpiler

Transpiler API to convert [php-parser](https://github.com/glayzzle/php-parser) AST to Javascript


[![npm version](https://badge.fury.io/js/php-transpiler.svg)](https://www.npmjs.com/package/php-transpiler)
[![Build Status](https://travis-ci.org/glayzzle/php-transpiler.svg?branch=master)](https://travis-ci.org/glayzzle/php-transpiler)
[![Coverage Status](https://coveralls.io/repos/github/glayzzle/php-transpiler/badge.svg?branch=master&v=0.0.5)](https://coveralls.io/github/glayzzle/php-transpiler?branch=master)
[![Gitter](https://img.shields.io/badge/GITTER-join%20chat-green.svg)](https://gitter.im/glayzzle/Lobby)

Installation
------------

This library is distributed with [npm](https://www.npmjs.com/package/php-transpiler) :

```sh
npm install php-transpiler --save
```

Usage
-----

```js
// initialize the php parser factory class
var engine = require('php-parser');
var transpiler = require('php-transpiler');

var jsCode = transpiler.generate(
  engine.parseCode('<?php echo "Hello World";')
);
console.log(jsCode);
```

# Misc

This library is released under BSD-3 license clause.
