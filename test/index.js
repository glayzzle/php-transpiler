var should = require('should');
var transpiler = require('../src/index');

describe('init', function() {
  it('should work', function() {
    var IO = new transpiler();
    console.log(
      IO.generate({
        kind: 'program',
        children: []
      })
    );
  });
});
