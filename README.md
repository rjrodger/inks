# inks
> Interpolate values from a shared context into a string template (or another object).

Substitutes sections of a string marked with `` by evaluating
contents. As a convenience, the values can be referenced from a
context object.

Used by [seneca-msg-test](//github.com/voxgig/seneca-msg-test) to
support back references to earlier test results.


[![npm version](https://badge.fury.io/js/inks.svg)](https://badge.fury.io/js/inks)
[![Build](https://github.com/rjrodger/inks/workflows/build/badge.svg)](https://github.com/rjrodger/inks/actions?query=workflow%3Abuild)
[![Coverage Status](https://coveralls.io/repos/github/rjrodger/inks/badge.svg?branch=main)](https://coveralls.io/github/rjrodger/inks?branch=main)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/11422/branches/169909/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=11422&bid=169909)
[![Maintainability](https://api.codeclimate.com/v1/badges/9475388ccbff2f0b6860/maintainability)](https://codeclimate.com/github/rjrodger/inks/maintainability)
[![Dependency Status](https://david-dm.org/rjrodger/inks.svg)](https://david-dm.org/rjrodger/inks)




## Quick Example


```js
const Inks = require('inks')

var out = Inks('`foo:bar`', {foo:{bar:'zed'}}) 
// out === 'zed'

out = Inks({deep:'`foo:bar`'}, {foo:{bar:'zed'}}) 
// out === {deep:'zed'}

out = Inks({deep:'`$.foo`'}, {foo:{bar:'zed'}}) 
// out === {deep:{bar:'zed'}}

```


Another example, where `$` references the context object.

```
const context = { red: { foo: 1, bar: 'zed'}, green: { fizz: { buzz: 'FRED' }} }
const template = 'Lorem `red:foo` ipsum `$.red.foo + $.red.bar.length` dolor `green:fizz.buzz` sit \\` amet.'

const result = Inks(template, context)

// prints:
// Lorem 1 ipsum 4 dolor FRED sit ` amet.

```

## Notes

* Value reference syntax: `key:dot-path`.
* General form: `<js-expression>` where `$ === context`.
* Single values are not converted to a string and retain their type: `red:foo` -> `1` not `'1'`.
* Anything that is not a number or string is converted to a string (if embedded) using `JSON.stringify`.
* Escape backticks by prefixing with a backslash: ```
'a\\`b' -> 'a`b'
```

## Questions?

[@rjrodger](https://twitter.com/rjrodger)


## License
Copyright (c) 2018-2020, Richard Rodger and other contributors.
Licensed under [MIT][].

[MIT]: ./LICENSE


