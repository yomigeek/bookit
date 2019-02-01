import { createUser, login } from "./auth";
import { bookings, cancelBooking, bookEvent } from "./booking";
import { events, createEvent } from "./events";

const rootResolver = {
  createUser,
  login,
  bookings,
  cancelBooking,
  bookEvent,
  events,
  createEvent
};

export default rootResolver;
