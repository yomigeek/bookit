import express from "express";
import bodyParser from "body-parser";
import graphqlHttp from "express-graphql";
import { conn } from "./config/database";
import { graphQlSchema } from "./schema";
import graphQlResolvers from "./resolvers/index";

const app = express();
const port = 5000;

app.use(bodyParser.json());

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
