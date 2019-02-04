import express from "express";
import bodyParser from "body-parser";
import graphqlHttp from "express-graphql";
import { conn } from "./config/database";
import { graphQlSchema } from "./schema";
import graphQlResolvers from "./resolvers/index";
import { isAuth } from "./middleware/checkAuth";
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const port = process.env.PORT || 5050;

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphapi",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

conn;

app.listen(port, () => {
  console.log(`GraphQL server is running on: ${port}`);
});
