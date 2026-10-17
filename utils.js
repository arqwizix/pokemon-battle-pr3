// Випадкове ціле число в межах від min до max включно.
export const randomDamage = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
