import bcrypt from "bcryptjs";

import Event from "../models/event";
import User from "../models/user";
import Booking from "../models/booking";

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: new Date(event._doc.date).toISOString(),
    creator: userFind.bind(this, event._doc.creator) //binds the id of the event creator to the userFind function
  };
};
/*
function to list events
*/
const eventsList = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: userFind.bind(this, event.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

/*
function to find a user
*/
const userFind = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: eventsList.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

// GET single event
const singleEvent = async eventId => {
  try {
    const event = await Event.findOne(eventId);
    return {
      ...event._doc,
      _id: event.id,
      creator: userFind.bind(this, event.creator)
    };
  } catch (err) {
    throw err;
  }
};

const graphQlResolvers = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
      // return events;
    } catch (err) {
      throw err;
    }
  },

  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          _id: booking.id,
          user: userFind.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString()
        };
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async args => {
    const fetchEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "5c4e388096418e67c536b183",
      event: fetchEvent
    });
    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      user: userFind.bind(this, result._doc.user),
      event: singleEvent.bind(this, result._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString()
    };
  },

  cancelBooking: async args => {
    try {
      const getBookedEvent = await Booking.findById(args.bookingId).populate(
        "event"
      );
      const bookedEvent = transformEvent(getBookedEvent.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return bookedEvent;
    } catch (err) {
      throw err;
    }
  },

  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5c4e388096418e67c536b183"
    });
    let createdEvent;
    try {
      const result = await event.save();

      createdEvent = transformEvent(result);

      const user = await User.findById("5c4e388096418e67c536b183");
      if (!user) {
        throw new Error("User not found!");
      }
      user.createdEvents.push(event);
      await user.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },

  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User Already Exist!");
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();
      return {
        ...result._doc,
        _id: result.id
      };
    } catch (err) {
      throw err;
    }
  }
};

export { graphQlResolvers };
