const events = [
  {
    id: "piojos",
    artist: "Los Piojos",
    title: "Ritual de verano",
    venue: "Estadio Unico de La Plata",
    city: "La Plata",
    date: "Sab 18 Jul",
    time: "21:00",
    day: "18",
    month: "Jul",
    category: "rock",
    demand: "Alta",
    stock: 23,
    from: 42000,
    tickets: [
      { id: "campo", name: "Campo", price: 42000, note: "Ingreso general de pie" },
      { id: "platea", name: "Platea lateral", price: 56000, note: "Ubicacion numerada demo" },
      { id: "vip", name: "Campo delantero", price: 78000, note: "Sector limitado" },
    ],
  },
  {
    id: "fundamentalistas",
    artist: "Los Fundamentalistas del Aire Acondicionado",
    title: "Misa ricotera en vivo",
    venue: "Estadio Malvinas Argentinas",
    city: "Mendoza",
    date: "Vie 24 Jul",
    time: "21:30",
    day: "24",
    month: "Jul",
    category: "rock",
    demand: "Muy alta",
    stock: 16,
    from: 48000,
    tickets: [
      { id: "popular", name: "Popular", price: 48000, note: "Acceso general" },
      { id: "platea", name: "Platea", price: 65000, note: "Sector numerado" },
      { id: "preferencial", name: "Preferencial", price: 89000, note: "Mejor vista disponible" },
    ],
  },
  {
    id: "kapanga",
    artist: "Kapanga",
    title: "Fiesta popular",
    venue: "C Complejo Art Media",
    city: "CABA",
    date: "Sab 01 Ago",
    time: "20:30",
    day: "01",
    month: "Ago",
    category: "festival",
    demand: "Media",
    stock: 41,
    from: 30000,
    tickets: [
      { id: "general", name: "General", price: 30000, note: "Pista" },
      { id: "balcon", name: "Balcon", price: 39000, note: "Vista elevada" },
      { id: "pack", name: "Pack amigos x4", price: 104000, note: "Precio promocional demo" },
    ],
  },
  {
    id: "divididos",
    artist: "Divididos",
    title: "Aplanadora del rock",
    venue: "Movistar Arena",
    city: "CABA",
    date: "Dom 09 Ago",
    time: "21:00",
    day: "09",
    month: "Ago",
    category: "rock",
    demand: "Alta",
    stock: 28,
    from: 52000,
    tickets: [
      { id: "campo", name: "Campo", price: 52000, note: "Ingreso general" },
      { id: "platea", name: "Platea baja", price: 69000, note: "Numerada" },
      { id: "vip", name: "Preferencial", price: 94000, note: "Sector premium demo" },
    ],
  },
  {
    id: "renga",
    artist: "La Renga",
    title: "Banquete rutero",
    venue: "Autodromo de Rosario",
    city: "Rosario",
    date: "Sab 15 Ago",
    time: "20:00",
    day: "15",
    month: "Ago",
    category: "festival",
    demand: "Muy alta",
    stock: 12,
    from: 45000,
    tickets: [
      { id: "general", name: "General", price: 45000, note: "Campo amplio" },
      { id: "front", name: "Campo delantero", price: 72000, note: "Cupo muy limitado" },
      { id: "bus", name: "Entrada + traslado", price: 88000, note: "Pack demo desde CABA" },
    ],
  },
  {
    id: "ciro",
    artist: "Ciro y los Persas",
    title: "Noche persa",
    venue: "Quality Arena",
    city: "Cordoba",
    date: "Vie 21 Ago",
    time: "21:00",
    day: "21",
    month: "Ago",
    category: "rock",
    demand: "Media",
    stock: 36,
    from: 39000,
    tickets: [
      { id: "campo", name: "Campo", price: 39000, note: "De pie" },
      { id: "platea", name: "Platea", price: 51000, note: "Numerada" },
      { id: "meet", name: "Experiencia fan", price: 96000, note: "Beneficio simulado" },
    ],
  },
  {
    id: "babasonicos",
    artist: "Babasonicos",
    title: "Show magnetico",
    venue: "Teatro Gran Rex",
    city: "CABA",
    date: "Jue 27 Ago",
    time: "20:30",
    day: "27",
    month: "Ago",
    category: "teatro",
    demand: "Alta",
    stock: 31,
    from: 58000,
    tickets: [
      { id: "pullman", name: "Pullman", price: 58000, note: "Vista panoramica" },
      { id: "platea", name: "Platea", price: 72000, note: "Numerada" },
      { id: "super", name: "Super pullman", price: 84000, note: "Sector central" },
    ],
  },
  {
    id: "eruca",
    artist: "Eruca Sativa",
    title: "Trio electrico",
    venue: "Auditorio Sur",
    city: "Temperley",
    date: "Sab 05 Sep",
    time: "21:00",
    day: "05",
    month: "Sep",
    category: "rock",
    demand: "Media",
    stock: 44,
    from: 28000,
    tickets: [
      { id: "general", name: "General", price: 28000, note: "Acceso pista" },
      { id: "terraza", name: "Terraza", price: 35000, note: "Sector elevado" },
      { id: "duo", name: "Pack duo", price: 50000, note: "Dos entradas demo" },
    ],
  },
];

const state = {
  filter: "todos",
  search: "",
  selectedEventId: events[0].id,
  queue: {
    active: false,
    ready: false,
    progress: 0,
    position: null,
    time: null,
    timerId: null,
  },
  cart: {},
};

const formatMoney = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const el = {
  eventList: document.querySelector("#event-list"),
  resultsCount: document.querySelector("#results-count"),
  searchInput: document.querySelector("#search-input"),
  filterPills: document.querySelectorAll(".filter-pill"),
  featuredBand: document.querySelector("#featured-band"),
  featuredVenue: document.querySelector("#featured-venue"),
  featuredTitle: document.querySelector("#featured-title"),
  featuredMeta: document.querySelector("#featured-meta"),
  featuredPrice: document.querySelector("#featured-price"),
  featuredStock: document.querySelector("#featured-stock"),
  featuredDemand: document.querySelector("#featured-demand"),
  selectedName: document.querySelector("#selected-name"),
  ticketTypes: document.querySelector("#ticket-types"),
  queueStatus: document.querySelector("#queue-status"),
  queueProgress: document.querySelector("#queue-progress"),
  queuePosition: document.querySelector("#queue-position"),
  queueTime: document.querySelector("#queue-time"),
  queueCopy: document.querySelector("#queue-copy"),
  queueButton: document.querySelector("#queue-button"),
  cartItems: document.querySelector("#cart-items"),
  cartCount: document.querySelector("#cart-count"),
  cartTotal: document.querySelector("#cart-total"),
  checkoutButton: document.querySelector("#checkout-button"),
  checkoutModal: document.querySelector("#checkout-modal"),
  fakeTicket: document.querySelector("#fake-ticket"),
  finishDemo: document.querySelector("#finish-demo"),
  clearCart: document.querySelector("#clear-cart"),
  resetDemo: document.querySelector("#reset-demo"),
  cartJump: document.querySelector("#cart-jump"),
  startFeatured: document.querySelector("#start-featured"),
  exploreEvents: document.querySelector("#explore-events"),
  steps: document.querySelectorAll(".step"),
};

function getSelectedEvent() {
  return events.find((event) => event.id === state.selectedEventId);
}

function getVisibleEvents() {
  return events.filter((event) => {
    const matchesFilter = state.filter === "todos" || event.category === state.filter;
    const matchesSearch = event.artist.toLowerCase().includes(state.search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
}

function renderEvents() {
  const visibleEvents = getVisibleEvents();
  el.resultsCount.textContent = `${visibleEvents.length} eventos`;
  el.eventList.innerHTML = visibleEvents
    .map(
      (event) => `
        <article class="event-row ${event.id === state.selectedEventId ? "selected" : ""}">
          <div class="date-box">
            <strong>${event.day}</strong>
            <span>${event.month}</span>
          </div>
          <div class="event-main">
            <strong class="artist-logo">${event.artist}</strong>
            <p>${event.title} · ${event.venue} · ${event.city} · ${event.time}</p>
            <div class="event-meta">
              <span class="availability">${event.stock}% disponible</span>
              <span class="category-tag">${event.category}</span>
              <span class="category-tag">desde ${formatMoney.format(event.from)}</span>
            </div>
          </div>
          <button class="select-event" type="button" data-event="${event.id}">Elegir</button>
        </article>
      `
    )
    .join("");
}

function renderFeatured() {
  const event = getSelectedEvent();
  el.featuredBand.textContent = event.artist;
  el.featuredVenue.textContent = event.venue;
  el.featuredTitle.textContent = `${event.artist} · ${event.title}`;
  el.featuredMeta.textContent = `${event.date} · ${event.time} · ${event.city}`;
  el.featuredPrice.textContent = formatMoney.format(event.from);
  el.featuredStock.textContent = `${event.stock}%`;
  el.featuredDemand.textContent = event.demand;
}

function renderTickets() {
  const event = getSelectedEvent();
  el.selectedName.textContent = event.artist;
  el.ticketTypes.innerHTML = event.tickets
    .map((ticket) => {
      const quantity = state.cart[ticketKey(event.id, ticket.id)]?.quantity || 0;
      return `
        <article class="ticket-row">
          <div>
            <h3>${ticket.name}</h3>
            <p>${ticket.note} · ${formatMoney.format(ticket.price)}</p>
          </div>
          <div class="qty-control" aria-label="Cantidad para ${ticket.name}">
            <button type="button" data-ticket="${ticket.id}" data-action="decrease" ${quantity === 0 ? "disabled" : ""}>−</button>
            <span>${quantity}</span>
            <button type="button" data-ticket="${ticket.id}" data-action="increase" ${!state.queue.ready ? "disabled" : ""}>+</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderQueue() {
  el.queueProgress.style.width = `${state.queue.progress}%`;
  el.queueStatus.classList.toggle("waiting", state.queue.active && !state.queue.ready);
  el.queueStatus.classList.toggle("ready", state.queue.ready);

  if (state.queue.ready) {
    el.queueStatus.textContent = "Turno activo";
    el.queuePosition.textContent = "0";
    el.queueTime.textContent = "Ahora";
    el.queueCopy.textContent = "Tu turno esta activo. Podes sumar entradas al carrito y avanzar al checkout demo.";
    el.queueButton.textContent = "Turno habilitado";
    el.queueButton.disabled = true;
    setActiveStep(3);
    return;
  }

  if (state.queue.active) {
    el.queueStatus.textContent = "En cola";
    el.queuePosition.textContent = state.queue.position;
    el.queueTime.textContent = `${state.queue.time} min`;
    el.queueCopy.textContent = "Mantenemos tu lugar mientras se liberan cupos para este show.";
    el.queueButton.textContent = "Esperando turno";
    el.queueButton.disabled = true;
    setActiveStep(2);
    return;
  }

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
  el.cartItems.innerHTML = lines.length
    ? lines
        .map(
          (line) => `
            <div class="cart-line">
              <span>${line.quantity} x ${line.artist} · ${line.name}</span>
              <strong>${formatMoney.format(line.price * line.quantity)}</strong>
            </div>
          `
        )
        .join("")
    : "<p>Todavia no agregaste entradas.</p>";
}

function setActiveStep(stepNumber) {
  el.steps.forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === stepNumber);
  });
}

function ticketKey(eventId, ticketId) {
  return `${eventId}:${ticketId}`;
}

function getCartLines() {
  return Object.values(state.cart);
}

function startQueue() {
  if (state.queue.active || state.queue.ready) return;
  state.queue.active = true;
  state.queue.progress = 4;
  state.queue.position = randomBetween(420, 900);
  state.queue.time = randomBetween(4, 8);
  renderAll();

  state.queue.timerId = window.setInterval(() => {
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
  }, 1100);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selectEvent(eventId) {
  state.selectedEventId = eventId;
  resetQueueOnly();
  renderAll();
  document.querySelector("#cola").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetQueueOnly() {
  if (state.queue.timerId) window.clearInterval(state.queue.timerId);
  state.queue = {
    active: false,
    ready: false,
    progress: 0,
    position: null,
    time: null,
    timerId: null,
  };
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
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  setActiveStep(4);
  el.fakeTicket.innerHTML = `
    <strong>NocheViva #${randomBetween(1000, 9999)}</strong>
    <span>${lines.map((line) => `${line.quantity} x ${line.artist}`).join(" · ")}</span>
    <p>Total demo: ${formatMoney.format(total)}</p>
  `;
  el.checkoutModal.showModal();
}

function clearCart() {
  state.cart = {};
  renderAll();
}

function resetDemo() {
  resetQueueOnly();
  state.cart = {};
  state.filter = "todos";
  state.search = "";
  state.selectedEventId = events[0].id;
  el.searchInput.value = "";
  el.filterPills.forEach((pill) => pill.classList.toggle("active", pill.dataset.filter === "todos"));
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAll() {
  renderEvents();
  renderFeatured();
  renderQueue();
  renderTickets();
  renderCart();
}

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
el.checkoutButton.addEventListener("click", checkout);
el.clearCart.addEventListener("click", clearCart);
el.resetDemo.addEventListener("click", resetDemo);
el.finishDemo.addEventListener("click", clearCart);

renderAll();
