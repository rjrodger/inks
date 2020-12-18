/*
  MIT License,
  Copyright (c) 2016-2020, Richard Rodger and other contributors.
*/
'use strict';
// TODO: support ternary expressions
module.exports = Inks;
const default_options = {
    exclude: () => false,
};
function Inks(val, ctxt, options = default_options) {
    return walk('$', val, make_modify_property(ctxt, options), options);
}
let walkers = {
    string: (key, val, modify_property) => {
        return modify_property(key, val);
    },
    object: (key, val, modify_property, options) => {
        if (null == val || options.exclude(key, val)) {
            return val;
        }
        var obj = {};
        Object.keys(val).forEach((key) => {
            obj[key] = walk(key, val[key], modify_property, options);
        });
        return obj;
    },
    array: (key, val, modify_property, options) => {
        var arr = [];
        for (var i = 0; i < val.length; i++) {
            arr.push(walk('' + i, val[i], modify_property, options));
        }
        return arr;
    },
    number: (key, val, modify_property) => {
        return val;
    },
    bigint: (key, val, modify_property) => {
        return val;
    },
    boolean: (key, val, modify_property) => {
        return val;
    },
    symbol: (key, val, modify_property) => {
        return val;
    },
    function: (key, val, modify_property) => {
        return val;
    },
    any: (key, val, modify_property) => {
        return val;
    },
};
function walk(key, val, modify_property, options) {
    let val_t = Array.isArray(val) ? 'array' : typeof val;
    let walker = walkers[val_t] || walkers.any;
    return walker(key, val, modify_property, options);
}
function make_modify_property(ctxt, options) {
    return function modify_property(key, val) {
        return options.exclude(key, val) ? val : replace_values(val, ctxt);
        //return replace_values(val, ctxt)
    };
}
function replace_values(tm, ctxt) {
    tm = tm.replace(/\\`/g, '\x07');
    var s = null;
    let m = null;
    var buf = [];
    var last = 0;
    while ((m = tm.substring(last).match(/(`.*?`)/))) {
        var cs = m[0].substring(1, m[0].length - 1);
        let index = m.index;
        s = tm.substring(last, last + index);
        if ('' !== s) {
            buf.push(s);
        }
        last = last + index + m[0].length;
        var csm = null;
        if ((csm = cs.match(/^([^:]+):(.*)$/))) {
            var key = csm[1];
            var path = csm[2];
            var obj = ctxt && ctxt[key];
            var val = null;
            if ('object' === typeof obj) {
                buf.push(handle_eval('$obj.' + path, obj, ctxt));
            }
            else {
                buf.push(null);
            }
        }
        else {
            buf.push(handle_eval(cs, null, ctxt));
        }
    }
    s = tm.substring(last, tm.length);
    if ('' !== s) {
        buf.push(s);
    }
    var out = null;
    // Preserve type if single value
    if (1 === buf.length) {
        out = buf[0];
    }
    else {
        buf = buf.map((x) => {
            if ('string' === typeof x || 'number' === typeof x) {
                return x;
            }
            else
                return JSON.stringify(x);
        });
        out = buf.join('');
    }
    if ('string' === typeof out) {
        out = out.replace(/\x07/g, '`');
    }
    return out;
}
// NOTE: function arguments are used by `eval`!
function handle_eval($vstr, $obj, $) {
    var $val = null;
    eval('$val = ' + $vstr);
    return null == $val ? null : $val;
}
//# sourceMappingURL=inks.js.map