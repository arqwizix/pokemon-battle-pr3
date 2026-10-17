// Клас для керування здоров'ям покемонів.
// Обидва учасники бою створюються через new Pokemon(...).
class Selectors {
    constructor(selectors) {
        this.eHP = document.getElementById(`health-${selectors}`);
        this.eProgressbar = document.getElementById(`progressbar-${selectors}`);
    }
}

export default class Pokemon extends Selectors {
    constructor({ name, type, hp, selectors }) {
        super(selectors);
        this.name = name;
        this.type = type;
        this.hp = { current: hp, total: hp };
        this.renderHP();
    }

    renderHP() {
        const { current, total } = this.hp;
        const percent = (current / total) * 100;
        this.eHP.textContent = `${current} / ${total}`;
        this.eProgressbar.style.width = `${percent}%`;
        this.eProgressbar.classList.toggle('low', percent <= 60 && percent > 25);
        this.eProgressbar.classList.toggle('critical', percent <= 25);
    }

    changeHP(damage, callback) {
        const previousHP = this.hp.current;
        this.hp.current = Math.max(0, previousHP - damage);
        this.renderHP();
        const actualDamage = previousHP - this.hp.current;
        if (callback) callback(actualDamage);
        return actualDamage;
    }

    resetHP() {
        this.hp.current = this.hp.total;
        this.renderHP();
    }
}
