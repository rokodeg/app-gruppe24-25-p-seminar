document.addEventListener('DOMContentLoaded', () => {
  const btnShowPwd  = document.getElementById('togglePassword');
  const btnShowConf = document.getElementById('toggleConfirm');
  const pwdInput    = document.getElementById('password');
  const confInput   = document.getElementById('confirmPassword');

  function toggleBoth() {
    const showing = pwdInput.type === 'text';
    pwdInput.type  = showing ? 'password' : 'text';
    confInput.type = showing ? 'password' : 'text';
    const icon = showing ? '👁️' : '🙈';
    btnShowPwd.textContent  = icon;
    btnShowConf.textContent = icon;
  }

  btnShowPwd.addEventListener('click', toggleBoth);
  btnShowConf.addEventListener('click', toggleBoth);

  // ... dein übriger Code (Passwort-Match, Modal-Logik) ...
});


const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const saveButton = document.getElementById('saveButton');
const matchMessage = document.getElementById('passwordMatchMessage');

function validatePasswords() {
  const pw1 = password.value;
  const pw2 = confirmPassword.value;

  const match = pw1 && pw2 && pw1 === pw2;
  saveButton.disabled = !match;

  // Erfolgsmeldung anzeigen/verstecken
  matchMessage.style.display = match ? 'block' : 'none';
}

// Echtzeitprüfung
password.addEventListener('input', validatePasswords);
confirmPassword.addEventListener('input', validatePasswords);

// Validierung beim Absenden
document.getElementById('settingsForm').addEventListener('submit', function(e) {
  if (password.value !== confirmPassword.value) {
    e.preventDefault();
    alert('Die Passwörter stimmen nicht überein.');
  }
});

// ➕ Wichtig: Bootstrap-Modal erst anzeigen, wenn DOM fertig ist
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === '1') {
    const modalEl = document.getElementById('successModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
});