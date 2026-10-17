import { logs } from './logs.js';
import { randomDamage } from './utils.js';

const logContainer = document.getElementById('logs');

// У повідомленні перший персонаж отримує шкоду, другий — атакує.
const generateLog = (defender, attacker) => {
    const template = logs[randomDamage(0, logs.length - 1)];
    return template.replaceAll('[ПЕРСОНАЖ №1]', defender.name)
                   .replaceAll('[ПЕРСОНАЖ №2]', attacker.name);
};

export const addBattleLog = (defender, attacker, damage) => {
    const { current, total } = defender.hp;
    const paragraph = document.createElement('p');
    paragraph.textContent = `${generateLog(defender, attacker)} -${damage}, [${current}/${total}]`;
    logContainer.insertBefore(paragraph, logContainer.firstChild);
    console.log(paragraph.textContent);
};

export const clearBattleLog = () => logContainer.replaceChildren();
