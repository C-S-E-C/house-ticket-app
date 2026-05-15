function menu_button(name, btn) {
    document.querySelectorAll('#menu button').forEach((b) => b.classList.remove('active'));
    if (btn) {
        btn.classList.add('active');
    }
    const frame = document.getElementById('pages');
    if (frame) {
        frame.src = `pages/${name}.html`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementsByTagName('button')[2].click();
});