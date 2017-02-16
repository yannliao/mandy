# Mandy


[![Build Status][travis-image]][travis-url]


Mandy is an HTTP server framework for node.js. It is created by taking cues from koa and connect.

# Example
    const Mandy = require('mandy');
    const http = require('http');

    const app = new Mandy();

    // respond to all requests
    app.use(function (req, res, next) {
      console.log('a');
      next();
    });

    app.use(function (req, res) {
      res.end('Hello world!\n');
    });

    //listen on port 3000
    app.listen(3000);


## Running Tests

```bash
yarn install
yarn test
```

## License

[MIT](LICENSE)

[travis-image]: https://travis-ci.org/yannliao/mandy.svg?branch=master
[travis-url]: https://travis-ci.org/yannliao/mandy
