import {
  state,
  getCartLines,
  getPurchasedTickets,
  getSelectedEvent,
  getVisibleEvents,
  ticketKey,
} from "../state/store.js";
import { formatMoney } from "../utils/formatters.js";
import { el } from "./dom.js";

export function renderAll() {
  renderEvents();
  renderFeatured();
  renderQueue();
  renderTickets();
  renderCart();
  renderAccount();
}

export function renderEvents() {
  const visibleEvents = getVisibleEvents();
  el.resultsCount.textContent = `${visibleEvents.length} eventos`;
  el.eventList.innerHTML = visibleEvents.map(createEventRow).join("");
}

function createEventRow(event) {
  return `
    <article class="event-row ${event.id === state.selectedEventId ? "selected" : ""}">
      <div class="date-box">
        <strong>${event.day}</strong>
        <span>${event.month}</span>
      </div>
      <div class="event-main">
        <strong class="artist-logo">${event.artist}</strong>
        <p>${event.title} / ${event.venue} / ${event.city} / ${event.time}</p>
        <div class="event-meta">
          <span class="availability">${event.stock}% disponible</span>
          <span class="category-tag">${event.category}</span>
          <span class="category-tag">desde ${formatMoney.format(event.from)}</span>
        </div>
      </div>
      <button class="select-event" type="button" data-event="${event.id}">Elegir</button>
    </article>
  `;
}

function renderFeatured() {
  const event = getSelectedEvent();
  el.featuredBand.textContent = event.artist;
  el.featuredVenue.textContent = event.venue;
  el.featuredTitle.textContent = `${event.artist} / ${event.title}`;
  el.featuredMeta.textContent = `${event.date} / ${event.time} / ${event.city}`;
  el.featuredPrice.textContent = formatMoney.format(event.from);
  el.featuredStock.textContent = `${event.stock}%`;
  el.featuredDemand.textContent = event.demand;
}

function renderTickets() {
  const event = getSelectedEvent();
  el.selectedName.textContent = event.artist;
  el.ticketTypes.innerHTML = event.tickets.map((ticket) => createTicketRow(event, ticket)).join("");
}

function createTicketRow(event, ticket) {
  const quantity = state.cart[ticketKey(event.id, ticket.id)]?.quantity || 0;
  return `
    <article class="ticket-row">
      <div>
        <h3>${ticket.name}</h3>
        <p>${ticket.note} / ${formatMoney.format(ticket.price)}</p>
      </div>
      <div class="qty-control" aria-label="Cantidad para ${ticket.name}">
        <button type="button" data-ticket="${ticket.id}" data-action="decrease" ${quantity === 0 ? "disabled" : ""}>-</button>
        <span>${quantity}</span>
        <button type="button" data-ticket="${ticket.id}" data-action="increase" ${!state.queue.ready ? "disabled" : ""}>+</button>
      </div>
    </article>
  `;
}

function renderQueue() {
  el.queueProgress.style.width = `${state.queue.progress}%`;
  el.queueStatus.classList.toggle("waiting", state.queue.active && !state.queue.ready);
  el.queueStatus.classList.toggle("ready", state.queue.ready);

  if (state.queue.ready) {
    renderReadyQueue();
    return;
  }

  if (state.queue.active) {
    renderWaitingQueue();
    return;
  }

  renderIdleQueue();
}

function renderReadyQueue() {
  el.queueStatus.textContent = "Turno activo";
  el.queuePosition.textContent = "0";
  el.queueTime.textContent = "Ahora";
  el.queueCopy.textContent = "Tu turno esta activo. Podes sumar entradas al carrito y avanzar al checkout demo.";
  el.queueButton.textContent = "Turno habilitado";
  el.queueButton.disabled = true;
  setActiveStep(3);
}

function renderWaitingQueue() {
  el.queueStatus.textContent = "En cola";
  el.queuePosition.textContent = state.queue.position;
  el.queueTime.textContent = `${state.queue.time} min`;
  el.queueCopy.textContent = "Mantenemos tu lugar mientras se liberan cupos para este show.";
  el.queueButton.textContent = "Esperando turno";
  el.queueButton.disabled = true;
  setActiveStep(2);
}

function renderIdleQueue() {
  el.queueStatus.textContent = "Lista";
  el.queuePosition.textContent = "--";
  el.queueTime.textContent = "--";
  el.queueCopy.textContent = "Elegi un evento y entra a la cola para habilitar la seleccion de entradas.";
  el.queueButton.textContent = "Entrar a la cola";
  el.queueButton.disabled = false;
  setActiveStep(1);
}

function renderCart() {
  const lines = getCartLines();
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const quantity = lines.reduce((sum, line) => sum + line.quantity, 0);

  el.cartCount.textContent = quantity;
  el.cartTotal.textContent = formatMoney.format(total);
  el.checkoutButton.disabled = quantity === 0;
  el.cartItems.innerHTML = lines.length ? lines.map(createCartLine).join("") : "<p>Todavia no agregaste entradas.</p>";
}

function createCartLine(line) {
  return `
    <div class="cart-line">
      <span>${line.quantity} x ${line.artist} / ${line.name}</span>
      <strong>${formatMoney.format(line.price * line.quantity)}</strong>
    </div>
  `;
}

export function setActiveStep(stepNumber) {
  el.steps.forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === stepNumber);
  });
}

function renderAccount() {
  const tickets = getPurchasedTickets();
  const userLabel = state.user ? state.user.name : "Registrarse";
  const ticketQuantity = tickets.reduce((total, ticket) => total + ticket.quantity, 0);

  el.sessionLabel.textContent = userLabel;
  el.authOpen.classList.toggle("logged", Boolean(state.user));
  el.logoutButton.classList.toggle("hidden", !state.user);
  el.accountAction.textContent = state.user ? "Comprar mas entradas" : "Crear usuario demo";
  el.accountCopy.textContent = state.user
    ? `${state.user.name}, tus tickets emitidos aparecen aca hasta que cierres, recargues o reinicies la demo.`
    : "Registrate para completar el checkout y ver tus entradas emitidas durante esta sesion.";
  el.userPanel.innerHTML = state.user
    ? createUserPanel(ticketQuantity)
    : '<div class="user-panel-empty">Sin usuario demo activo.</div>';

  el.myTickets.innerHTML = tickets.length
    ? tickets.map(createPurchasedTicket).join("")
    : '<p class="empty-state">Todavia no tenes tickets comprados en esta sesion.</p>';
}

function createUserPanel(ticketQuantity) {
  return `
    <div class="user-avatar">${state.user.name.charAt(0).toUpperCase()}</div>
    <div>
      <strong>${state.user.name}</strong>
      <span>${state.user.email}</span>
    </div>
    <div class="user-ticket-count">
      <strong>${ticketQuantity}</strong>
      <span>tickets</span>
    </div>
  `;
}

function createPurchasedTicket(ticket) {
  return `
    <article class="owned-ticket">
      <div>
        <span class="ticket-code">${ticket.code}</span>
        <strong>${ticket.artist}</strong>
        <p>${ticket.name} / ${ticket.venue} / ${ticket.date} / ${ticket.time}</p>
      </div>
      <span class="ticket-qty">${ticket.quantity} entrada${ticket.quantity > 1 ? "s" : ""}</span>
    </article>
  `;
}
