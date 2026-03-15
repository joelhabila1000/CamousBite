export const formatNaira = (value) => `₦${Number(value || 0).toLocaleString()}`;

export const clampQty = (value) => Math.max(1, value);

export const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const formatTimeLabel = (date) => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${minutes} ${suffix}`;
};
