import bcrypt from 'bcryptjs';

import Event from '../models/event';
import User from '../models/user';


/*
function to list events
*/
const eventsList = async eventIds => {
  try {
    const events = await Event.find({_id: { $in: eventIds }});
      events.map(event => {
         return {
           ...event._doc,
           _id: event.id,
           date: new Date(event._doc.date).toISOString(),
           creator: userFind.bind(this, event.creator)
         };
     });
     return events;
  }
  catch(err) {
    throw err;
  }
};

/*
function to find a user
*/
const userFind = async userId => {
  try {
    const user =  await User.findById(userId);
    return {
        ...user._doc,
        _id: user.id,
        createdEvents: eventsList.bind(this, user._doc.createdEvents)
      }; 
  }
  catch(err) {
    throw err;
  }
};

const graphQlResolvers = {
  events: async () => {
    try {
      const events = await Event.find();
        return events.map(event => {
              return { 
                ...event._doc, 
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: userFind.bind(this,  event._doc.creator) //binds the id of the event creator to the userFind function
              }
          });
          // return events;
        }
    catch (err) {
      throw err;
    };
  },
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date) ,
      creator: '5c4e388096418e67c536b183'
    });
    let createdEvent; 
    try {
      const result = await event.save();
      createdEvent = { 
        ...result._doc, 
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: userFind.bind(this, result._doc.creator)
       };
      const user = await User.findById('5c4e388096418e67c536b183');
        if(!user) {
          throw new Error('User not found!');
        }
        user.createdEvents.push(event);
       await  user.save();
      return createdEvent;
    }
    catch(err) {
      throw err;
    };
  },

  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
          throw new Error('User Already Exist!');
        }

       const hashedPassword = await bcrypt.hash(args.userInput.password, 12);  
        
       const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });

       const result = await user.save();
      return { 
        ...result._doc, _id: result.id
       }; 
      }
      catch (err) {
        throw err;
    };
  }
} ;

export { graphQlResolvers };
