"use strict";

// Створюємо персонажів за допомогою об'єктів.
const character = {
    name: "Pikachu",
    defaultHP: 100,
    damageHP: 100,
    eHP: document.getElementById("health-character"),
    eProgressbar: document.getElementById("progressbar-character"),
    renderHP,
    changeHP,
    resetHP
};

const enemy = {
    name: "Charmander",
    defaultHP: 100,
    damageHP: 100,
    eHP: document.getElementById("health-enemy"),
    eProgressbar: document.getElementById("progressbar-enemy"),
    renderHP,
    changeHP,
    resetHP
};

const btnKick = document.getElementById("btn-kick");
const btnStrong = document.getElementById("btn-strong");
const btnReset = document.getElementById("btn-reset");
const message = document.getElementById("battle-message");
let isGameOver = false;

// Спільна функція для двох об'єктів. this — поточний персонаж.
function renderHP() {
    const percent = (this.damageHP / this.defaultHP) * 100;
    this.eHP.textContent = `${this.damageHP} / ${this.defaultHP}`;
    this.eProgressbar.style.width = `${percent}%`;
    this.eProgressbar.classList.toggle("low", percent <= 60 && percent > 25);
    this.eProgressbar.classList.toggle("critical", percent <= 25);
}

function randomDamage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ці методи викликаються як character.changeHP() та enemy.changeHP().
function changeHP(damage) {
    this.damageHP = Math.max(0, this.damageHP - damage);
    this.renderHP();
}

function resetHP() {
    this.damageHP = this.defaultHP;
    this.renderHP();
}

function finishGame(winner) {
    isGameOver = true;
    btnKick.disabled = true;
    btnStrong.disabled = true;
    message.textContent = `Переміг ${winner.name}! Натисніть «Нова гра».`;
}

// Дві атаки використовують одну функцію, але мають різну силу.
function attack(type) {
    if (isGameOver) return;

    let damageToEnemy;
    let damageToCharacter;

    if (type === "strong") {
        damageToEnemy = randomDamage(16, 27);
        damageToCharacter = randomDamage(8, 17);
    } else {
        damageToEnemy = randomDamage(7, 15);
        damageToCharacter = randomDamage(4, 12);
    }

    enemy.changeHP(damageToEnemy);
    if (enemy.damageHP === 0) {
        finishGame(character);
        return;
    }

    character.changeHP(damageToCharacter);
    if (character.damageHP === 0) {
        finishGame(enemy);
        return;
    }

    message.textContent = `Pikachu завдав ${damageToEnemy} шкоди. Charmander відповів: ${damageToCharacter}.`;
}

function resetGame() {
    character.resetHP();
    enemy.resetHP();
    isGameOver = false;
    btnKick.disabled = false;
    btnStrong.disabled = false;
    message.textContent = "Оберіть атаку, щоб розпочати бій.";
}

btnKick.addEventListener("click", () => attack("normal"));
btnStrong.addEventListener("click", () => attack("strong"));
btnReset.addEventListener("click", resetGame);
resetGame();