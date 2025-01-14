// Funktion zum Laden der Anfragen
function loadRequests() {
  const anfragen = JSON.parse(localStorage.getItem('anfragen')) || [];
  const anfragenListContainer = document.getElementById('anfragenList');
  anfragenListContainer.innerHTML = '';  // Leere den Container, bevor neue Anfragen hinzugefügt werden

  if (anfragen.length > 0) {
    anfragen.forEach(function(anfrage, index) {
      const anfrageDiv = document.createElement('div');
      anfrageDiv.classList.add('anfrage-container');
      
      // Erstelle HTML-Inhalt für jede Anfrage
      anfrageDiv.innerHTML = `
        <div class="anfrage">
          <h3>${anfrage.name} ${anfrage.nachname}</h3>
          <p><strong>Fach:</strong> ${anfrage.fach}</p>
          <p><strong>Klassenstufe:</strong> ${anfrage.klassenstufe}</p>
          <p><strong>Stunden pro Woche:</strong> ${anfrage.stunden}</p>
          <p><strong>Dringlichkeit:</strong> ${anfrage.dringlichkeit}</p>
          <p><strong>Kontakt:</strong> ${anfrage.kontakt}</p>
          <button onclick="confirmRequest(${index})">Bestätigen</button>
          <button class="reject-btn" onclick="rejectRequest(${index})">Ablehnen</button>
          <button class="delete-btn" onclick="deleteRequest(${index})">Löschen</button>
        </div>
      `;
      
      // Füge die Anfrage zum Container hinzu
      anfragenListContainer.appendChild(anfrageDiv);
    });
  } else {
    anfragenListContainer.innerHTML = '<p>Keine Anfragen vorhanden.</p>';
  }
}

// Funktion für die Bestätigung der Anfrage
function confirmRequest(index) {
  const anfragen = JSON.parse(localStorage.getItem('anfragen')) || [];
  // Hier kannst du die Anfrage als "bestätigt" markieren
  alert('Anfrage bestätigt!');
}

// Funktion für das Ablehnen der Anfrage
function rejectRequest(index) {
  const anfragen = JSON.parse(localStorage.getItem('anfragen')) || [];
  // Hier kannst du die Anfrage als "abgelehnt" markieren
  alert('Anfrage abgelehnt!');
}

// Funktion zum Löschen der Anfrage
function deleteRequest(index) {
  const anfragen = JSON.parse(localStorage.getItem('anfragen')) || [];
  anfragen.splice(index, 1);  // Entferne die Anfrage aus dem Array
  localStorage.setItem('anfragen', JSON.stringify(anfragen));  // Speichere die aktualisierten Anfragen zurück
  loadRequests();  // Lade die Anfragen neu
}

// Funktion zum Anzeigen und Verbergen von bestätigten Anfragen
function toggleConfirmedRequests() {
  const confirmedRequestsList = document.getElementById('confirmedRequestsList');
  const isVisible = confirmedRequestsList.style.display === 'block';

  // Toggle der Sichtbarkeit
  if (isVisible) {
    confirmedRequestsList.style.display = 'none';
  } else {
    confirmedRequestsList.style.display = 'block';
  }
}

// Funktion zum Anzeigen und Verbergen von abgelehnten Anfragen
function toggleRejectedRequests() {
  const rejectedRequestsList = document.getElementById('rejectedRequestsList');
  const isVisible = rejectedRequestsList.style.display === 'block';

  // Toggle der Sichtbarkeit
  if (isVisible) {
    rejectedRequestsList.style.display = 'none';
  } else {
    rejectedRequestsList.style.display = 'block';
  }
}

// Funktion zum Laden der Anfragen bei Seitenaufruf
window.onload = function() {
  loadRequests();  // Lade die Anfragen aus localStorage
};
