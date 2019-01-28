import express from 'express';
import bodyParser from 'body-parser';   
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql';
import bcrypt from 'bcryptjs';

import { conn } from './config/database';
import Event from './models/event';
import User from './models/user';

const app = express();
const port = 5000;

const eventsList = eventIds => {
  return Event.find({
    _id: {
       $in: eventIds
    }
  })
  .then(
    events => {
      return events.map(
        event => {
          return {
            ...event._doc,
            _id: event.id,
            creator: userFind.bind(this, event.creator)
          }
      })
    }
  )
  .catch(
    err => {
      throw err;
    }
  )
}

const userFind = userId => {
  return User
  .findById(userId)
  .then( 
    user => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: eventsList.bind(this, user._doc.createdEvents)
      }
  })
  .catch( err => {
    throw err;
  })
}

app.use(bodyParser.json ());

app.use('/graphapi', graphqlHttp({
  schema: buildSchema(`

    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }

    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [Event!]
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event 
      createUser(userInput:  UserInput): User
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
      .then( events => {
            return events.map(event => {
              return { 
                ...event._doc, 
                _id: event.id,
                creator: userFind.bind(this,  event._doc.creator) //binds the id of the event creator to the userFind function
              }
          })
          // return events;
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
        creator: '5c4e388096418e67c536b183'
      });
      let createdEvent; 
      return event
      .save()
      .then( 
        result => {
        createdEvent = { ...result._doc, _id: result._doc._id.toString() };
        return User.findById('5c4e388096418e67c536b183');
      })
      .then(
        user => {
          if(!user) {
            throw new Error('User not found!');
          }
          user.createdEvents.push(event);
          return user.save();
      })
      .then(
        result  => {
        return createdEvent;
      })
      .catch((err => {
        throw err;
      }));
    },
    createUser: args => {
      return User.findOne({
        email: args.userInput.email
      })
      .then(
        user => {
          if(user) {
            throw new Error('User Already Exist!');
          }
          return bcrypt.hash(args.userInput.password, 12);  
      })
      .then(
        hashedPassword => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });

          return user.save();
      })
      .then(
        result => {
          return { ...result._doc, _id: result.id }; 
      })
      .catch(
        err => {
          throw err;
      });
    }
  },
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`GraphQL server is running on: ${port}`);
});
