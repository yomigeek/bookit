import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

app.use(bodyParser.json ());

app.get('/', (req, res, next) => {
  res.json('Welcome to my GraphQL API');
});

app.listen(port, () => {
  console.log(`GraphQL server is running on: ${port}`);
});
