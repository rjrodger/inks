/*
  MIT License,
  Copyright (c) 2016-2018, Richard Rodger and other contributors.
*/

'use strict'


module.exports = Inks

function Inks(tm, ctxt) {
  tm = tm.replace(/\\`/g, '\x07')

  var s = null
  var m = null
  var buf = []
  var last = 0
  while(m = tm.substring(last).match(/(`.*?`)/)) {
    var cs = m[0]

    s = tm.substring(last,last+m.index)
    if(''!==s) { buf.push(s) }

    last = last + m.index + m[0].length

    var csm = null
    if(csm = cs.match(/^`(.*?):(.*?)`$/)) {
      var key = csm[1]
      var path = csm[2]
      var obj = ctxt[key]
      var val = null

      if('object' === typeof obj) {
        buf.push(handle_eval('$obj.'+path, obj, ctxt))
      }
      else {
        buf.push(null)
      }
    }
    else {
      buf.push(handle_eval(cs.substring(1,cs.length-1), null, ctxt))
    }
  }
  s = tm.substring(last,tm.length)
  if(''!==s) { buf.push(s) }

  //console.log('B',buf)
  

  var out = null

  // Preserve type if single value
  if( 1 === buf.length ) {
    out = buf[0]
  }
  else {
    buf = buf.map((x)=>{
      if('string' === typeof x || 'number' === typeof x) {
        return x
      }
      else return JSON.stringify(x)
    })
    out = buf.join('')
  }
  
  if('string' === typeof out) {
    out = out.replace(/\x07/g, '`')
  }

  return out
}


function handle_eval() {
  var $val = null
  var $vstr = arguments[0]
  var $obj = arguments[1]
  var $ = arguments[2]

  eval('$val = '+$vstr)

  return null == $val ? null : $val
}
