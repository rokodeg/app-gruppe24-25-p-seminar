// Funktion, um das Formular zu validieren und abzusenden
function submitForm(event) {
  event.preventDefault(); // Verhindert das Standard-Formular-Absenden

  const name = document.getElementById('name').value;
  const nachname = document.getElementById('nachname').value;
  const geschlecht = document.getElementById('geschlecht').value;
  const fach = document.getElementById('fach').value;
  const wohnort = document.getElementById('wohnort').value;
  const stunden = document.getElementById('stunden').value;
  const klassenstufe = document.getElementById('klassenstufe').value;
  const anmerkungen = document.getElementById('anmerkungen').value;
  const kontakt = document.getElementById('kontakt').value;
  const einheit = document.querySelector('input[name="einheit"]:checked')?.value;
  const agb = document.getElementById('agb').checked;
  const errorMessage = document.getElementById('error-message');

  // Prüfung, ob alle Felder ausgefüllt sind
  if (!name || !nachname || !geschlecht || !fach || !wohnort || !stunden || !klassenstufe || !kontakt || !einheit || !agb) {
    errorMessage.textContent = 'Bitte füllen Sie alle Felder aus und akzeptieren Sie die AGB.';
    return false; // Verhindert das Absenden des Formulars
  }

  // Optional: Speichern der Anfrage im LocalStorage oder Absenden an einen Server
  const anfrage = {
    name: name,
    nachname: nachname,
    geschlecht: geschlecht,
    fach: fach,
    wohnort: wohnort,
    stunden: stunden,
    klassenstufe: klassenstufe,
    anmerkungen: anmerkungen,
    kontakt: kontakt,
    einheit: einheit,
  };

  // Speichern der Anfrage im LocalStorage (optional)
  let anfragen = JSON.parse(localStorage.getItem('anfragen')) || [];
  anfragen.push(anfrage);
  localStorage.setItem('anfragen', JSON.stringify(anfragen));

  // Erfolgreiche Anfrage-Absenden
  alert('Ihre Anfrage wurde erfolgreich abgesendet!'); // Pop-up ohne Bestätigung
  document.getElementById('anfrageForm').reset(); // Formular zurücksetzen
  return false; // Verhindert das Absenden der Seite
}

// Event Listener hinzufügen, um die submitForm-Funktion beim Absenden des Formulars aufzurufen
document.getElementById('anfrageForm').addEventListener('submit', submitForm);
