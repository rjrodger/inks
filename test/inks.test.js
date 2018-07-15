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
    fin()
  })
})
