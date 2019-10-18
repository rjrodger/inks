/* Copyright (c) 2018 Richard Rodger and other contributors, MIT License */
'use strict'

var Inks = require('..')

var Code = require('@hapi/code')
var Lab = require('@hapi/lab')

var lab = (exports.lab = Lab.script())
var describe = lab.describe
var it = lab.it
var expect = Code.expect

describe('inks', function() {
  it('happy', async () => {
    expect(Inks('`foo:a`')).equal(null)
    expect(Inks('`foo:a`', { foo: {} })).equal(null)
    expect(Inks('`foo:a`', { foo: { a: 'z' } })).equal('z')
    expect(Inks('`foo:a`', { foo: { a: 1 } })).equal(1)
    expect(Inks('`foo:a`', { foo: { a: { x: 1 } } })).equal({ x: 1 })
    expect(Inks('`foo:a`~`foo:b`', { foo: { a: 'z', b: 'y' } })).equal('z~y')
    expect(Inks('`foo:a`', { foo: { a: 1 } })).equal(1)
    expect(Inks('`foo:a`', { foo: { a: { b: 1 } } })).equal({ b: 1 })
    expect(Inks('|`foo:a`|', { foo: { a: { b: 1 } } })).equal('|{"b":1}|')
    expect(Inks('|`foo:a`|', { foo: { a: 'x' } })).equal('|x|')
    expect(Inks('|`foo:a`|', { foo: { a: 9 } })).equal('|9|')
    expect(Inks('`bar:a`', { foo: { a: 1 } })).equal(null)
    expect(Inks('`foo:b`', { foo: { a: 1 } })).equal(null)
    expect(Inks('`1+1`', {})).equal(2)
    expect(Inks('`1+1`')).equal(2)
    expect(Inks('`$.a`x`$.b`y`$.c`', { a: '', b: '', c: '' })).equal('xy')
    expect(Inks('q`$.a`x`$.b`y`$.c`w', { a: '', b: '', c: '' })).equal('qxyw')
  })
})
