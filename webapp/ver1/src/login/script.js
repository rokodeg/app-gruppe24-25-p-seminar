document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    // Einfache Validierung
    if (username === 'admin' && password === 'passwort') {
        message.textContent = 'Anmeldung erfolgreich!';
        message.style.color = 'green';
        window.location.href = 'admin.html'; // Hier die URL zur gewünschten Seite ändern
    } else {
        message.textContent = 'Ungültiger Benutzername oder Passwort.';
        message.style.color = 'red';
    }
});
