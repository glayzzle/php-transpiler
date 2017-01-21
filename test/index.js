var should = require('should');
var transpiler = require('../src/index');
var parser = require('php-parser');

var a = function() { };
a.prototype.foo = function() { return 'a-foo'; };
a.extend = function(fn) {
  fn.prototype = new this();
  fn.extend = this.extend.bind(fn);
  fn.prototype.constructor = fn;
  return fn;
};

var b = a.extend(function() { });
b.prototype.foo = function() { return 'b-foo'; };

var c = b.extend(function() { });
c.prototype.foo = function() { return 'c-foo'; };

var iA = new a();
var iB = new b();
var iC = new c();

console.log(iB.foo() + ' is A', iB instanceof a);
console.log(iB.foo() + ' is C', iB instanceof c);
console.log(iC.foo() + ' is B', iC instanceof b);
console.log(iC.foo() + ' is A', iC instanceof a);


describe('init', function() {
  it('should work', function() {
    var filename = 'foo.php';
    console.log(
      transpiler.generate(
        parser.parseCode([
          '<?php',
          'namespace foo\\bar {',
          '  echo "Hello world";',
          '  $a = 1;',
          '  $b = 2;',
          '  $c = $a + $b;',
          '}'
        ].join('\n'), {
          parser: {
            extractDoc: true
          },
          ast: {
            withPositions: true
          }
        }, filename),
        null, filename
      )
    );
  });
});
