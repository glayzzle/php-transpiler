var should = require('should');
var transpiler = require('../src/index');
var parser = require('php-parser');

describe('init', function() {
  it('should work', function() {
    console.log(
      transpiler.generate(
        parser.parseCode('<?php echo "Hello world";')
      )
    );
  });
});
