import { QR } from './moudle.js';

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('pass') != null) {
        QR.generate('qrcode', localStorage.getItem('pass'), 250);
    }
});