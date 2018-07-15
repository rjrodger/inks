/*
  MIT License,
  Copyright (c) 2016-2018, Richard Rodger and other contributors.
*/

'use strict'


module.exports = Inks

function Inks(tm, ctxt) {
  tm = tm.replace(/\\`/g, '\x07')

  var m = null
  var buf = []
  var last = 0
  while(m = tm.substring(last).match(/(`.*?`)/)) {
    var cs = m[0]
    buf.push(tm.substring(last,m.index))
    last = last + m.index + m[0].length

    var csm = null
    if(csm = cs.match(/^`(.*?):(.*?)`$/)) {
      var key = csm[1]
      var path = csm[2]
      var obj = ctxt[key]
      var val = ''
      if(obj) {
        var evalstr = 'val = obj.'+path
        eval(evalstr)
        buf.push(val)
      }
    }
  }
  buf.push(tm.substring(last,tm.length))

  // Preserve type if single value
  var out = 1 === buf.length ? buf[0] : buf.join('')

  if('string' === typeof out) {
    out = out.replace(/\x07/g, '`')
  }

  return out
}
