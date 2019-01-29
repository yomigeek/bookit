import { createUser } from "./auth";
import { bookings, cancelBooking, bookEvent } from "./booking";
import { events, createEvent } from "./events";

const rootResolver = {
  createUser,
  bookings,
  cancelBooking,
  bookEvent,
  events,
  createEvent
};

export default rootResolver;
