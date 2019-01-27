import express from 'express';
import bodyParser from 'body-parser';   
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();
const port = 5000;

app.use(bodyParser.json ());

app.use('/graphapi', graphqlHttp({
  schema: buildSchema(`

    type RootQuery {
      events: [String!]!
    }

    type RootMutation {
      createEvent(name: String): String  
    }
    
    schema {
      query: RootQuery 
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return ['ALC','Omu resort'];
    },
    createEvent: (args) => {
      const eventName = args.name;
      return eventName; 
    }
  },
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`GraphQL server is running on: ${port}`);
});
