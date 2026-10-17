"use strict";

// Один набір методів використовується двома різними об'єктами через this.
function renderHP() {
    const { damageHP, defaultHP, eHP, eProgressbar } = this;
    const percent = (damageHP / defaultHP) * 100;
    eHP.textContent = `${damageHP} / ${defaultHP}`;
    eProgressbar.style.width = `${percent}%`;
    eProgressbar.classList.toggle("low", percent <= 60 && percent > 25);
    eProgressbar.classList.toggle("critical", percent <= 25);
}

function changeHP(damage) {
    this.damageHP = Math.max(0, this.damageHP - damage);
    this.renderHP();
}

function resetHP() {
    this.damageHP = this.defaultHP;
    this.renderHP();
}

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
const logsContainer = document.querySelector("#logs");
let isGameOver = false;

function randomDamage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Випадковий рядок беремо з архіву logs.js, вставляємо імена учасників.
function generateLog(firstPerson, secondPerson) {
    const { name: firstName } = firstPerson;
    const { name: secondName } = secondPerson;
    const line = logs[Math.floor(Math.random() * logs.length)];
    return line.replaceAll("[ПЕРСОНАЖ №1]", firstName)
               .replaceAll("[ПЕРСОНАЖ №2]", secondName);
}

// Створення p і додавання на початок #logs (нові події завжди зверху).
function addBattleLog(defender, attacker, actualDamage) {
    const { damageHP, defaultHP } = defender;
    const text = `${generateLog(defender, attacker)} -${actualDamage}, [${damageHP}/${defaultHP}]`;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    logsContainer.insertBefore(paragraph, logsContainer.firstChild);
}

function hit(defender, attacker, damage) {
    const previousHP = defender.damageHP;
    defender.changeHP(damage);
    addBattleLog(defender, attacker, previousHP - defender.damageHP);
}

function finishGame(winner) {
    const { name } = winner;
    isGameOver = true;
    message.textContent = `Переміг ${name}! Натисніть «Нова гра».`;
    updateButtons();
}

function attack(type) {
    if (isGameOver) return;

    const strong = type === "strong";
    const damageToEnemy = strong ? randomDamage(16, 27) : randomDamage(7, 15);
    const damageToCharacter = strong ? randomDamage(8, 17) : randomDamage(4, 12);

    hit(enemy, character, damageToEnemy);
    if (enemy.damageHP === 0) {
        finishGame(character);
        return;
    }

    hit(character, enemy, damageToCharacter);
    if (character.damageHP === 0) {
        finishGame(enemy);
        return;
    }

    message.textContent = `${character.name} завдав ${damageToEnemy} шкоди. ${enemy.name} відповів: ${damageToCharacter}.`;
}

function resetGame() {
    character.resetHP();
    enemy.resetHP();
    isGameOver = false;
    logsContainer.replaceChildren();
    kickCounter.reset();
    strongCounter.reset();
    message.textContent = "Оберіть атаку, щоб розпочати бій.";
    updateButtons();
}

// Замикання: окрема змінна clicks для кожної кнопки атаки.
// Стрілкові функції захоплюють стан і зберігають його між натисканнями.
function createClickCounter(button, counterElement, name, action, limit = 7) {
    let clicks = 0;
    const remaining = () => limit - clicks;
    const hasClicks = () => remaining() > 0;
    const renderCounter = () => {
        counterElement.textContent = `Залишилося натискань: ${remaining()}`;
    };
    const onClick = () => {
        if (!hasClicks()) return;
        clicks += 1;
        renderCounter();
        console.log(`${name}: натискань ${clicks}, залишилося ${remaining()}`);
        action();
        updateButtons();
    };
    renderCounter();
    button.addEventListener("click", onClick);
    const reset = () => {
        clicks = 0;
        renderCounter();
    };
    return { hasClicks, reset };
}

const kickCounter = createClickCounter(
    btnKick, document.getElementById("counter-kick"),
    "Thunder Jolt", () => attack("normal")
);
const strongCounter = createClickCounter(
    btnStrong, document.getElementById("counter-strong"),
    "Thunderbolt", () => attack("strong")
);
btnReset.addEventListener("click", resetGame);

function updateButtons() {
    btnKick.disabled = isGameOver || !kickCounter.hasClicks();
    btnStrong.disabled = isGameOver || !strongCounter.hasClicks();
    if (!isGameOver && !kickCounter.hasClicks() && !strongCounter.hasClicks()) {
        message.textContent = "Ліміт атак вичерпано. Натисніть «Нова гра», щоб почати знову.";
    }
}

// Нова гра скидає HP, журнал бою та обидва лічильники атак.
resetGame();
