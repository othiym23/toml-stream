[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![Build Status](https://travis-ci.org/othiym23/toml-stream.svg)](https://travis-ci.org/othiym23/toml-stream)
[![Coverage Status](https://coveralls.io/repos/othiym23/toml-stream/badge.svg?branch=master)](https://coveralls.io/r/othiym23/toml-stream?branch=master)

# TOMLStream

Pipe an object stream into this and get a crisp, clear stream of
[TOML](https://github.com/toml-lang/toml) data. Because TOML is ultimately a
key-value store, piping bare arrays into it makes no sense and will raise an
error. At some point it may validate the input against a schema, but that's too
fancy for now.

Fancy bonus feature: if you pass in a string instead of an object, the stream
will emit that as a TOML comment.

## usage

```javascript
var TOMLStream = require('toml-stream')

var stream = new TOMLStream()
stream.pipe(process.stdout)
stream.end({key: 'value'})
// prints 'key = "value"' to stdout
```

## MIT License

The MIT License (MIT)

Copyright (c) 2015 Forrest L Norvell <ogd@aoaioxxysz.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
