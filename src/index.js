const express = require('express');
const app = express();
const { uuid, isUuid } = require('uuidv4');

app.use(express.json());

const products = [];

const logRequest = (req, res, next) => {
  const { method, url } = req;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
};

const validateProductId = (req, res, next) => {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Product not found' });
  }
  return next();
};

app.use(logRequest);

app.get('/products', (req, res) => {
  const { name } = req.params;
  const results = name
    ? products.filter((product) => product.name.includes(name))
    : products;
  return res.json(results);
});

app.post('/products', (req, res) => {
  const { price, name } = req.body;
  const product = { price, name, id: uuid() };

  products.push(product);
  return res.json(product);
});

app.put('/products/:id', validateProductId, (req, res) => {
  const { id } = req.params;
  const { price, name } = req.body;

  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex < 0) {
    return res.status(400).json({ error: 'Product not found' });
  }

  const product = {
    price,
    name,
    id,
  };
  products[productIndex] = product;
  return res.json(product);
});

app.delete('/products/:id', validateProductId, (req, res) => {
  const { id } = req.params;
  const { price, name } = req.body;

  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex < 0) {
    return res.status(400).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  return res.status(204).send();
});

app.listen(3333, () => {
  console.log('🤔 Listen on port 3333');
});
