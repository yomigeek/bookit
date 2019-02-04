import Booking from "../models/booking";
import { transformBooking, transformEvent } from "./helperFunctions";
import Event from "../models/event";

export const bookings = async () => {
  const { isUserAuth } = req;
  if (!isUserAuth) {
    throw new Error("Unauthorized Access!");
  }
  try {
    const bookings = await Booking.find();
    return bookings.map(booking => {
      return transformBooking(booking);
    });
  } catch (err) {
    throw err;
  }
};

export const bookEvent = async args => {
  const { isUserAuth, userId } = req;
  if (!isUserAuth) {
    throw new Error("Unauthorized Access!");
  }
  try {
    const fetchEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: userId,
      event: fetchEvent
    });
    const result = await booking.save();
    return transformBooking(result);
  } catch (err) {
    throw err;
  }
};

export const cancelBooking = async args => {
  const { isUserAuth } = req;
  if (!isUserAuth) {
    throw new Error("Unauthorized Access!");
  }
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
};
