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
  showPage("tickets");
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
  showPage("home");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openAuthModal() {
  clearAuthError();
  el.authModal.showModal();
  window.setTimeout(() => el.authName.focus(), 0);
}

function registerUser(event) {
  event.preventDefault();
  const name = el.authName.value.trim();
  const email = el.authEmail.value.trim();
  const password = el.authPassword.value;
  const validationError = validateCredentials({ name, email, password });

  if (validationError) {
    showAuthError(validationError.message, validationError.field);
    return;
  }

  state.user = { name, email };
  el.authForm.reset();
  clearAuthError();
  el.authModal.close();
  renderAll();
  showPage("tickets");
}

function logoutUser() {
  state.user = null;
  state.purchasedTickets = [];
  renderAll();
}

function validateCredentials({ name, email, password }) {
  if (!name) return { field: el.authName, message: "Ingresa un nombre para crear el usuario demo." };
  if (!isValidEmail(email)) return { field: el.authEmail, message: "Ingresa un email valido. Ejemplo: leo@nocheviva.demo" };
  if (password.length < 8 || password.length > 15) {
    return { field: el.authPassword, message: "La contraseña debe tener entre 8 y 15 caracteres." };
  }
  if (countPasswordTypes(password) < 3) {
    return {
      field: el.authPassword,
      message: "La contraseña debe combinar al menos 3 tipos: minusculas, mayusculas, numeros o simbolos.",
    };
  }
  return null;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function countPasswordTypes(password) {
  const checks = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];
  return checks.filter((regex) => regex.test(password)).length;
}

function showAuthError(message, field) {
  clearAuthError();
  el.authError.textContent = message;
  field.setAttribute("aria-invalid", "true");
  field.focus();
}

function clearAuthError() {
  el.authError.textContent = "";
  el.authName.removeAttribute("aria-invalid");
  el.authEmail.removeAttribute("aria-invalid");
  el.authPassword.removeAttribute("aria-invalid");
}

function showPage(pageName) {
  el.pageViews.forEach((page) => {
    page.classList.toggle("active", page.dataset.page === pageName);
  });
  el.routeLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.route === pageName);
  });
  window.location.hash = pageName === "tickets" ? "mis-tickets" : "";
}

function showHomeAndScroll(targetSelector) {
  showPage("home");
  window.setTimeout(() => {
    document.querySelector(targetSelector).scrollIntoView({ behavior: "smooth", block: "start" });
  }, 0);
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
    showHomeAndScroll("#cola");
    startQueue();
  });
  el.exploreEvents.addEventListener("click", () => showHomeAndScroll("#eventos"));
  el.cartJump.addEventListener("click", () => showHomeAndScroll("#cart-panel"));
  el.authOpen.addEventListener("click", () => {
    if (state.user) {
      showPage("tickets");
      return;
    }
    openAuthModal();
  });
  el.accountAction.addEventListener("click", () => {
    if (state.user) {
      showHomeAndScroll("#eventos");
      return;
    }
    openAuthModal();
  });
  el.routeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const route = link.dataset.route;
      if (route === "tickets") {
        event.preventDefault();
        showPage("tickets");
        return;
      }
      event.preventDefault();
      showHomeAndScroll(link.getAttribute("href"));
    });
  });
  el.authEmail.addEventListener("input", clearAuthError);
  el.authName.addEventListener("input", clearAuthError);
  el.authPassword.addEventListener("input", clearAuthError);
  el.authForm.addEventListener("submit", registerUser);
  el.logoutButton.addEventListener("click", logoutUser);
  el.checkoutButton.addEventListener("click", checkout);
  el.clearCart.addEventListener("click", clearCart);
  el.resetDemo.addEventListener("click", resetDemo);
  el.finishDemo.addEventListener("click", clearCart);
}

bindEvents();
if (window.location.hash === "#mis-tickets") {
  showPage("tickets");
}
renderAll();
