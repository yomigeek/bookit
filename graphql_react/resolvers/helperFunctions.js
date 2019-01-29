import Event from "../models/event";
import User from "../models/user";
import { dateToString } from "../helpers/date";

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
        date: dateToString(event._doc.date),
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

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: userFind.bind(this, event._doc.creator) //binds the id of the event creator to the userFind function
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: userFind.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};
export { transformEvent, transformBooking, singleEvent };
