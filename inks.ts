/*
  MIT License,
  Copyright (c) 2016-2020, Richard Rodger and other contributors.
*/

'use strict'

module.exports = Inks

interface Options {
  exclude: (key: string, val: any) => boolean
}

type ModifyProperty = (key: string, val: string) => string

const default_options = {
  exclude: () => false,
}

function Inks(val: any, ctxt: any, options: Options = default_options) {
  return walk('$', val, make_modify_property(ctxt, options), options)
}

let walkers: any = {
  string: (key: string, val: string, modify_property: ModifyProperty) => {
    return modify_property(key, val)
  },

  object: (
    key: string,
    val: { [key: string]: any },
    modify_property: ModifyProperty,
    options: Options
  ) => {
    if (null == val || options.exclude(key, val)) {
      return val
    }

    var obj: { [key: string]: any } = {}

    Object.keys(val).forEach((key) => {
      obj[key] = walk(key, val[key], modify_property, options)
    })

    return obj
  },

  array: (
    key: string,
    val: any[],
    modify_property: ModifyProperty,
    options: Options
  ) => {
    var arr: any[] = []

    for (var i = 0; i < val.length; i++) {
      arr.push(walk('' + i, val[i], modify_property, options))
    }

    return arr
  },

  number: (key: string, val: number, modify_property: ModifyProperty) => {
    return val
  },
  bigint: (key: string, val: bigint, modify_property: ModifyProperty) => {
    return val
  },
  boolean: (key: string, val: boolean, modify_property: ModifyProperty) => {
    return val
  },
  symbol: (key: string, val: symbol, modify_property: ModifyProperty) => {
    return val
  },
  function: (key: string, val: any, modify_property: ModifyProperty) => {
    return val
  },
  any: (key: string, val: any, modify_property: ModifyProperty) => {
    return val
  },
}

function walk(
  key: string,
  val: any,
  modify_property: ModifyProperty,
  options: Options
): any {
  let val_t: string = Array.isArray(val) ? 'array' : typeof val
  let walker: any = walkers[val_t] || walkers.any
  return walker(key, val, modify_property, options)
}

function make_modify_property(ctxt: any, options: Options) {
  return function modify_property(key: string, val: string) {
    return options.exclude(key, val) ? val : replace_values(val, ctxt)
    //return replace_values(val, ctxt)
  }
}

function replace_values(tm: string, ctxt: any) {
  tm = tm.replace(/\\`/g, '\x07')

  var s = null
  let m: RegExpMatchArray | null = null
  var buf = []
  var last = 0
  while ((m = tm.substring(last).match(/(`.*?`)/))) {
    var cs = m[0].substring(1, m[0].length - 1)

    let index: number = <number>m.index

    s = tm.substring(last, last + index)
    if ('' !== s) {
      buf.push(s)
    }

    last = last + index + m[0].length

    var csm = null
    if ((csm = cs.match(/^([^:]+):(.*)$/))) {
      var key = csm[1]
      var path = csm[2]
      var obj = ctxt && ctxt[key]
      var val = null

      if ('object' === typeof obj) {
        buf.push(handle_eval('$obj.' + path, obj, ctxt))
      } else {
        buf.push(null)
      }
    } else {
      buf.push(handle_eval(cs, null, ctxt))
    }
  }
  s = tm.substring(last, tm.length)
  if ('' !== s) {
    buf.push(s)
  }

  var out = null

  // Preserve type if single value
  if (1 === buf.length) {
    out = buf[0]
  } else {
    buf = buf.map((x) => {
      if ('string' === typeof x || 'number' === typeof x) {
        return x
      } else return JSON.stringify(x)
    })
    out = buf.join('')
  }

  if ('string' === typeof out) {
    out = out.replace(/\x07/g, '`')
  }

  return out
}

// NOTE: function arguments are used by `eval`!
function handle_eval($vstr: string, $obj: object | null, $: object): any {
  var $val = null

  eval('$val = ' + $vstr)

  return null == $val ? null : $val
}
