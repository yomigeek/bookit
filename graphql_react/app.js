import express from 'express';
import bodyParser from 'body-parser';   
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql';
import conn from './config/database';

const app = express();
const port = 5000;
const events = [];

app.use(bodyParser.json ());

app.use('/graphapi', graphqlHttp({
  schema: buildSchema(`

    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event 
    }
    
    schema {
      query: RootQuery 
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return events ;
    },
    createEvent: (args) => {
      const event = {
        _id: Math.random().toString(),
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.createdAt ,
      }
      events.push(event);
      return event;
    }
  },
  graphiql: true,
}));

conn;

app.listen(port, () => {
  console.log(`GraphQL server is running on: ${port}`);
});
