import { QR } from './qrcode.js';

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('pass') != null) {
        new QRCode(document.getElementById("qrcode"), {
            text: "https://example.com",
            width: 200,
            height: 200,
            correctLevel: QRCode.CorrectLevel.H
        });
    }
});