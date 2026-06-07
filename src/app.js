import { events } from "./data/events.js";
import { initialQueue, state, getCartLines, getSelectedEvent, ticketKey } from "./state/store.js";
import { el } from "./ui/dom.js";
import { renderAll, renderEvents, setActiveStep } from "./ui/render.js";
import { formatMoney, randomBetween } from "./utils/formatters.js";

function startQueue() {
  if (state.queue.active || state.queue.ready) return;

  state.queue.active = true;
  state.queue.progress = 4;
  state.queue.position = randomBetween(420, 900);
  state.queue.time = randomBetween(4, 8);
  renderAll();

  state.queue.timerId = window.setInterval(updateQueueProgress, 1100);
}

function updateQueueProgress() {
  const nextProgress = Math.min(100, state.queue.progress + randomBetween(8, 17));
  state.queue.progress = nextProgress;
  state.queue.position = Math.max(0, state.queue.position - randomBetween(75, 160));
  state.queue.time = Math.max(1, Math.ceil((100 - nextProgress) / 18));

  if (nextProgress >= 100 || state.queue.position === 0) {
    window.clearInterval(state.queue.timerId);
    state.queue.progress = 100;
    state.queue.position = 0;
    state.queue.time = 0;
    state.queue.ready = true;
    state.queue.active = false;
  }

  renderAll();
}

function selectEvent(eventId) {
  state.selectedEventId = eventId;
  resetQueueOnly();
  renderAll();
  document.querySelector("#cola").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetQueueOnly() {
  if (state.queue.timerId) window.clearInterval(state.queue.timerId);
  state.queue = { ...initialQueue };
}

function updateTicket(ticketId, action) {
  if (!state.queue.ready) return;

  const event = getSelectedEvent();
  const ticket = event.tickets.find((item) => item.id === ticketId);
  const key = ticketKey(event.id, ticket.id);
  const current = state.cart[key]?.quantity || 0;
  const next = action === "increase" ? Math.min(current + 1, 6) : Math.max(current - 1, 0);

  if (next === 0) {
    delete state.cart[key];
  } else {
    state.cart[key] = {
      key,
      eventId: event.id,
      artist: event.artist,
      name: ticket.name,
      price: ticket.price,
      quantity: next,
    };
  }

  renderAll();
}

function checkout() {
  const lines = getCartLines();
  if (!lines.length) return;

  if (!state.user) {
    openAuthModal();
    return;
  }

  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const issuedTickets = issuePurchasedTickets(lines);
  state.purchasedTickets = [...issuedTickets, ...state.purchasedTickets];
  state.cart = {};
  renderAll();
  setActiveStep(4);
  el.fakeTicket.innerHTML = `
    <strong>NocheViva #${randomBetween(1000, 9999)}</strong>
    <span>${issuedTickets.map((ticket) => `${ticket.quantity} x ${ticket.artist}`).join(" / ")}</span>
    <p>Total demo: ${formatMoney.format(total)}</p>
    <p>Quedaron disponibles en Mis tickets para ${state.user.name}.</p>
  `;
  el.checkoutModal.showModal();
}

function issuePurchasedTickets(lines) {
  return lines.map((line) => {
    const event = events.find((item) => item.id === line.eventId);
    return {
      code: `NV-${randomBetween(10000, 99999)}`,
      artist: line.artist,
      name: line.name,
      quantity: line.quantity,
      venue: event.venue,
      date: event.date,
      time: event.time,
    };
  });
}

function clearCart() {
  state.cart = {};
  renderAll();
}

function resetDemo() {
  resetQueueOnly();
  state.cart = {};
  state.user = null;
  state.purchasedTickets = [];
  state.filter = "todos";
  state.search = "";
  state.selectedEventId = events[0].id;
  el.searchInput.value = "";
  el.filterPills.forEach((pill) => pill.classList.toggle("active", pill.dataset.filter === "todos"));
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openAuthModal() {
  el.authModal.showModal();
  window.setTimeout(() => el.authName.focus(), 0);
}

function registerUser(event) {
  event.preventDefault();
  const name = el.authName.value.trim();
  const email = el.authEmail.value.trim();

  if (!name || !email) return;

  state.user = { name, email };
  el.authForm.reset();
  el.authModal.close();
  renderAll();
  document.querySelector("#mis-tickets").scrollIntoView({ behavior: "smooth", block: "start" });
}

function logoutUser() {
  state.user = null;
  state.purchasedTickets = [];
  renderAll();
}

function bindEvents() {
  el.eventList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-event]");
    if (button) selectEvent(button.dataset.event);
  });

  el.ticketTypes.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ticket]");
    if (button) updateTicket(button.dataset.ticket, button.dataset.action);
  });

  el.filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      state.filter = pill.dataset.filter;
      el.filterPills.forEach((item) => item.classList.toggle("active", item === pill));
      renderEvents();
    });
  });

  el.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderEvents();
  });

  el.queueButton.addEventListener("click", startQueue);
  el.startFeatured.addEventListener("click", () => {
    document.querySelector("#cola").scrollIntoView({ behavior: "smooth", block: "start" });
    startQueue();
  });
  el.exploreEvents.addEventListener("click", () => document.querySelector("#eventos").scrollIntoView({ behavior: "smooth" }));
  el.cartJump.addEventListener("click", () => document.querySelector("#cart-panel").scrollIntoView({ behavior: "smooth" }));
  el.authOpen.addEventListener("click", openAuthModal);
  el.accountAction.addEventListener("click", () => {
    if (state.user) {
      document.querySelector("#mis-tickets").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    openAuthModal();
  });
  el.authForm.addEventListener("submit", registerUser);
  el.logoutButton.addEventListener("click", logoutUser);
  el.checkoutButton.addEventListener("click", checkout);
  el.clearCart.addEventListener("click", clearCart);
  el.resetDemo.addEventListener("click", resetDemo);
  el.finishDemo.addEventListener("click", clearCart);
}

bindEvents();
renderAll();
