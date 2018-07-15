/* Copyright (c) 2018 Richard Rodger and other contributors, MIT License */
'use strict'

var Inks = require('..')

var Code = require('code')
var Lab = require('lab')

var lab = (exports.lab = Lab.script())
var describe = lab.describe
var it = lab.it
var expect = Code.expect

describe('inks', function() {
  it('happy', function(fin) {
    expect(Inks('`foo:a`',{foo:{a:'z'}})).equal('z')
    expect(Inks('`foo:a`~`foo:b`',{foo:{a:'z',b:'y'}})).equal('z~y')
    expect(Inks('`foo:a`',{foo:{a:1}})).equal(1)
    expect(Inks('`foo:a`',{foo:{a:{b:1}}})).equal({b:1})
    expect(Inks('|`foo:a`|',{foo:{a:{b:1}}})).equal('|{"b":1}|')
    expect(Inks('`bar:a`',{foo:{a:1}})).equal(null)
    expect(Inks('`foo:b`',{foo:{a:1}})).equal(null)
    expect(Inks('`1+1`',{})).equal(2)
    expect(Inks('`$.a`x`$.b`y`$.c`',{a:'',b:'',c:''})).equal('xy')
    expect(Inks('q`$.a`x`$.b`y`$.c`w',{a:'',b:'',c:''})).equal('qxyw')
    fin()
  })
})
