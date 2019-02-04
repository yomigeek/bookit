import Event from "../models/event";
import User from "../models/user";
import { transformEvent } from "./helperFunctions";

export const events = async () => {
  try {
    const events = await Event.find();
    return events.map(event => {
      return transformEvent(event);
    });
    // return events;
  } catch (err) {
    throw err;
  }
};

export const createEvent = async (args, req) => {
  const { isUserAuth, userId } = req;
  if (!isUserAuth) {
    throw new Error("Unauthorized Access!");
  }
  const event = new Event({
    title: args.eventInput.title,
    description: args.eventInput.description,
    price: +args.eventInput.price,
    date: new Date(args.eventInput.date),
    creator: userId
  });
  let createdEvent;
  try {
    const result = await event.save();

    createdEvent = transformEvent(result);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }
    user.createdEvents.push(event);
    await user.save();
    return createdEvent;
  } catch (err) {
    throw err;
  }
};
