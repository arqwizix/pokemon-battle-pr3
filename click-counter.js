// Замикання: кожна кнопка отримує власну незалежну змінну clicks.
export default function createClickCounter({ button, label, name, action, onChange, limit = 7 }) {
    let clicks = 0;
    const remaining = () => limit - clicks;
    const hasClicks = () => remaining() > 0;
    const render = () => {
        label.textContent = `Залишилося натискань: ${remaining()}`;
    };

    button.addEventListener('click', () => {
        if (!hasClicks()) return;
        clicks++;
        render();
        console.log(`${name}: натискань ${clicks}, залишилося ${remaining()}`);
        action();
        onChange();
    });

    const reset = () => {
        clicks = 0;
        render();
    };

    render();
    return { hasClicks, reset };
}
