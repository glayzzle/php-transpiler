/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var fs = require('fs');
var should = require('should');
var parser = require('php-parser');

var transpiler = require('../src/index');
var mock = require('./mock');


describe('init', function() {
  it('should work', function() {
    var filename = 'fibo.php';
    var contents = fs.readFileSync(__dirname + '/' + filename).toString();
    console.log(
      transpiler.generate(
        parser.parseCode(
          contents, {
            parser: {
              extractDoc: true
            },
            ast: {
              withPositions: true
            }
          },
          filename
        ),
        {
          // mode: 'closure'
        },
        filename
      )
    );
  });
});
