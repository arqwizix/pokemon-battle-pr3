import Pokemon from './pokemon.js';
import { randomDamage } from './utils.js';
import { addBattleLog, clearBattleLog } from './battle-log.js';
import createClickCounter from './click-counter.js';

// Один клас створює і героя, і його противника.
const character = new Pokemon({
    name: 'Pikachu', type: 'electric', hp: 100, selectors: 'character'
});
const enemy = new Pokemon({
    name: 'Charmander', type: 'fire', hp: 100, selectors: 'enemy'
});

const btnKick = document.getElementById('btn-kick');
const btnStrong = document.getElementById('btn-strong');
const btnReset = document.getElementById('btn-reset');
const message = document.getElementById('battle-message');
let isGameOver = false;

const updateButtons = () => {
    btnKick.disabled = isGameOver || !kickCounter.hasClicks();
    btnStrong.disabled = isGameOver || !strongCounter.hasClicks();
    if (!isGameOver && !kickCounter.hasClicks() && !strongCounter.hasClicks()) {
        message.textContent = 'Ліміт атак вичерпано. Натисніть «Нова гра», щоб почати знову.';
    }
};

const finishGame = winner => {
    isGameOver = true;
    message.textContent = `Переміг ${winner.name}! Натисніть «Нова гра».`;
    updateButtons();
};

// Лог бою виводиться через callback методу Pokemon.changeHP().
const hit = (defender, attacker, damage) => {
    defender.changeHP(damage, actualDamage => {
        addBattleLog(defender, attacker, actualDamage);
    });
};

const attack = type => {
    if (isGameOver) return;
    const strong = type === 'strong';
    const damageToEnemy = strong ? randomDamage(16, 27) : randomDamage(7, 15);
    const damageToCharacter = strong ? randomDamage(8, 17) : randomDamage(4, 12);

    hit(enemy, character, damageToEnemy);
    if (enemy.hp.current === 0) {
        finishGame(character);
        return;
    }

    hit(character, enemy, damageToCharacter);
    if (character.hp.current === 0) {
        finishGame(enemy);
        return;
    }

    message.textContent = `${character.name} завдав ${damageToEnemy} шкоди. ${enemy.name} відповів: ${damageToCharacter}.`;
};

const resetGame = () => {
    character.resetHP();
    enemy.resetHP();
    isGameOver = false;
    clearBattleLog();
    kickCounter.reset();
    strongCounter.reset();
    message.textContent = 'Оберіть атаку, щоб розпочати бій.';
    updateButtons();
};

const kickCounter = createClickCounter({
    button: btnKick,
    label: document.getElementById('counter-kick'),
    name: 'Thunder Jolt',
    action: () => attack('normal'),
    onChange: updateButtons
});
const strongCounter = createClickCounter({
    button: btnStrong,
    label: document.getElementById('counter-strong'),
    name: 'Thunderbolt',
    action: () => attack('strong'),
    onChange: updateButtons
});
btnReset.addEventListener('click', resetGame);
resetGame();
