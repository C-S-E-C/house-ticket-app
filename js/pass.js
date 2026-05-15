import QR from './qrcode.js';

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('pass') != null) {
        new QR(document.getElementById("qrcode"), {
            text: "https://example.com",
            width: 200,
            height: 200,
            correctLevel: QR.CorrectLevel.H
        });
    }
});