const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const fetch = require('isomorphic-fetch');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(bodyParser.json());

    server.post('/gdom', (req, res) => {
      const query = req.body.query;
      console.log('QUERY', query);
      fetch(`http://gdom.graphene-python.org/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
      })
        .then(res => res.json())
        .then(result => {
          console.log('RESULT', result);
          res.json(result);
        });
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
