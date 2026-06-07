export const formatMoney = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
