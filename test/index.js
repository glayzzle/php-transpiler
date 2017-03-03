/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-transpiler/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var fs = require('fs');
var should = require('should');

var transpiler = require('../src/index');
var mock = require('./mock');


describe('init', function() {
  var translator = new transpiler({
    browser: true
  });
  var PATH = __dirname + '/demo/';
  it('fibo.php', function() {
    var filename = 'fibo.php';
    var contents = fs.readFileSync(PATH + filename).toString();
    console.log(translator.read(contents, filename));
  });
  it('file.php', function() {
    var filename = 'file.php';
    var contents = fs.readFileSync(PATH + filename).toString();
    console.log(translator.read(contents, filename));
  });
  it('namespace.php', function() {
    var filename = 'namespace.php';
    var contents = fs.readFileSync(PATH + filename).toString();
    console.log(translator.read(contents, filename));
  });
  it('class.php', function() {
    var filename = 'class.php';
    var contents = fs.readFileSync(PATH + filename).toString();
    console.log(translator.read(contents, filename));
  });
});
