import { events } from "../data/events.js";

export const initialQueue = {
  active: false,
  ready: false,
  progress: 0,
  position: null,
  time: null,
  timerId: null,
};

export const state = {
  filter: "todos",
  search: "",
  selectedEventId: events[0].id,
  queue: { ...initialQueue },
  cart: {},
  user: null,
  purchasedTickets: [],
};

export function getSelectedEvent() {
  return events.find((event) => event.id === state.selectedEventId);
}

export function getVisibleEvents() {
  return events.filter((event) => {
    const matchesFilter = state.filter === "todos" || event.category === state.filter;
    const matchesSearch = event.artist.toLowerCase().includes(state.search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
}

export function getCartLines() {
  return Object.values(state.cart);
}

export function getPurchasedTickets() {
  return state.purchasedTickets;
}

export function hasPurchasedTicketForEvent(eventId) {
  const event = events.find((item) => item.id === eventId);
  return state.purchasedTickets.some((ticket) => ticket.eventId === eventId || ticket.artist === event?.artist);
}

export function ticketKey(eventId, ticketId) {
  return `${eventId}:${ticketId}`;
}
