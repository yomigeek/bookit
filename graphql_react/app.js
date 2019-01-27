import express from 'express';
import bodyParser from 'body-parser';   
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql';
import { conn } from './config/database';
import Event from './models/events';

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
      return Event
      .find()
      .then(
        (events) => {
          events.map(event => {
            return { ...event._doc }
          })
        }
      )
      .catch((err) => {
        throw err;
      });
    },
    createEvent: args => {
      
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date) ,
      });
      
      return event
      .save()
      .then((result) => {
        console.log(result, 'Created!');
        return result;
      })
      .catch((err => {
        console.log(err);
        throw err;
      }));
    }
  },
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`GraphQL server is running on: ${port}`);
});
