"use strict";

// Створюємо персонажів за допомогою об'єктів.
const character = {
    name: "Pikachu",
    defaultHP: 100,
    damageHP: 100,
    eHP: document.getElementById("health-character"),
    eProgressbar: document.getElementById("progressbar-character")
};

const enemy = {
    name: "Charmander",
    defaultHP: 100,
    damageHP: 100,
    eHP: document.getElementById("health-enemy"),
    eProgressbar: document.getElementById("progressbar-enemy")
};

const btnKick = document.getElementById("btn-kick");
const btnStrong = document.getElementById("btn-strong");
const btnReset = document.getElementById("btn-reset");
const message = document.getElementById("battle-message");
let isGameOver = false;

// Одна спільна функція для обох персонажів.
function renderHP(person) {
    const percent = (person.damageHP / person.defaultHP) * 100;
    person.eHP.textContent = `${person.damageHP} / ${person.defaultHP}`;
    person.eProgressbar.style.width = `${percent}%`;
    person.eProgressbar.classList.toggle("low", percent <= 60 && percent > 25);
    person.eProgressbar.classList.toggle("critical", percent <= 25);
}

function randomDamage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeHP(damage, person) {
    person.damageHP = Math.max(0, person.damageHP - damage);
    renderHP(person);
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

    changeHP(damageToEnemy, enemy);
    if (enemy.damageHP === 0) {
        finishGame(character);
        return;
    }

    changeHP(damageToCharacter, character);
    if (character.damageHP === 0) {
        finishGame(enemy);
        return;
    }

    message.textContent = `Pikachu завдав ${damageToEnemy} шкоди. Charmander відповів: ${damageToCharacter}.`;
}

function resetGame() {
    character.damageHP = character.defaultHP;
    enemy.damageHP = enemy.defaultHP;
    isGameOver = false;
    btnKick.disabled = false;
    btnStrong.disabled = false;
    message.textContent = "Оберіть атаку, щоб розпочати бій.";
    renderHP(character);
    renderHP(enemy);
}

btnKick.addEventListener("click", () => attack("normal"));
btnStrong.addEventListener("click", () => attack("strong"));
btnReset.addEventListener("click", resetGame);
resetGame();