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
  const confirmedRequests = JSON.parse(localStorage.getItem('confirmedRequests')) || [];
  
  const confirmedRequest = anfragen.splice(index, 1)[0]; // Entfernt die Anfrage aus den offenen Anfragen und speichert sie in "confirmedRequests"
  confirmedRequests.push(confirmedRequest); // Fügt sie den bestätigten Anfragen hinzu

  localStorage.setItem('anfragen', JSON.stringify(anfragen));  // Speichere die offenen Anfragen
  localStorage.setItem('confirmedRequests', JSON.stringify(confirmedRequests));  // Speichere die bestätigten Anfragen
  
  loadRequests();  // Lade die Anfragen neu
  loadConfirmedRequests();  // Lade die bestätigten Anfragen neu
  alert('Anfrage bestätigt!');
}

// Funktion für das Ablehnen der Anfrage
function rejectRequest(index) {
  const anfragen = JSON.parse(localStorage.getItem('anfragen')) || [];
  const rejectedRequests = JSON.parse(localStorage.getItem('rejectedRequests')) || [];
  
  const rejectedRequest = anfragen.splice(index, 1)[0]; // Entfernt die Anfrage aus den offenen Anfragen und speichert sie in "rejectedRequests"
  rejectedRequests.push(rejectedRequest); // Fügt sie den abgelehnten Anfragen hinzu

  localStorage.setItem('anfragen', JSON.stringify(anfragen));  // Speichere die offenen Anfragen
  localStorage.setItem('rejectedRequests', JSON.stringify(rejectedRequests));  // Speichere die abgelehnten Anfragen
  
  loadRequests();  // Lade die Anfragen neu
  loadRejectedRequests();  // Lade die abgelehnten Anfragen neu
  alert('Anfrage abgelehnt!');
}

// Funktion zum Löschen der Anfrage
function clearAllRequests() {
  // Leere den localStorage für die Anfragen
  localStorage.removeItem('anfragen');
  localStorage.removeItem('confirmedRequests');
  localStorage.removeItem('rejectedRequests');

  // Lade die Anfragen neu, um die Anzeige zu aktualisieren
  loadRequests();
  loadConfirmedRequests();
  loadRejectedRequests();

  alert('Alle Anfragen wurden gelöscht.');
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

// Funktion zum Laden der bestätigten Anfragen
function loadConfirmedRequests() {
  const confirmedRequests = JSON.parse(localStorage.getItem('confirmedRequests')) || [];
  const confirmedRequestsListContainer = document.getElementById('confirmedRequestsList');
  confirmedRequestsListContainer.innerHTML = '';  // Leere den Container, bevor neue Anfragen hinzugefügt werden

  if (confirmedRequests.length > 0) {
    confirmedRequests.forEach(function(anfrage) {
      const anfrageDiv = document.createElement('div');
      anfrageDiv.classList.add('anfrage-container');
      
      // Erstelle HTML-Inhalt für jede bestätigte Anfrage
      anfrageDiv.innerHTML = `
        <div class="anfrage">
          <h3>${anfrage.name}</h3>
          <p><strong>Fach:</strong> ${anfrage.fach}</p>
          <p><strong>Stundenanzahl:</strong> ${anfrage.stunden}</p>
          <p><strong>Zusätzliche Infos:</strong> ${anfrage.info || 'Keine zusätzlichen Infos'}</p>
        </div>
      `;
      
      // Füge die bestätigte Anfrage zum Container hinzu
      confirmedRequestsListContainer.appendChild(anfrageDiv);
    });
  } else {
    confirmedRequestsListContainer.innerHTML = '<p>Keine bestätigten Anfragen vorhanden.</p>';
  }
}

// Funktion zum Laden der abgelehnten Anfragen
function loadRejectedRequests() {
  const rejectedRequests = JSON.parse(localStorage.getItem('rejectedRequests')) || [];
  const rejectedRequestsListContainer = document.getElementById('rejectedRequestsList');
  rejectedRequestsListContainer.innerHTML = '';  // Leere den Container, bevor neue Anfragen hinzugefügt werden

  if (rejectedRequests.length > 0) {
    rejectedRequests.forEach(function(anfrage) {
      const anfrageDiv = document.createElement('div');
      anfrageDiv.classList.add('anfrage-container');
      
      // Erstelle HTML-Inhalt für jede abgelehnte Anfrage
      anfrageDiv.innerHTML = `
        <div class="anfrage">
          <h3>${anfrage.name}</h3>
          <p><strong>Fach:</strong> ${anfrage.fach}</p>
          <p><strong>Stundenanzahl:</strong> ${anfrage.stunden}</p>
          <p><strong>Zusätzliche Infos:</strong> ${anfrage.info || 'Keine zusätzlichen Infos'}</p>
        </div>
      `;
      
      // Füge die abgelehnte Anfrage zum Container hinzu
      rejectedRequestsListContainer.appendChild(anfrageDiv);
    });
  } else {
    rejectedRequestsListContainer.innerHTML = '<p>Keine abgelehnten Anfragen vorhanden.</p>';
  }
}

// Lade alle Listen beim Seitenaufruf
window.onload = function() {
  loadRequests();  // Lade die Anfragen aus localStorage
  loadConfirmedRequests();  // Lade die bestätigten Anfragen
  loadRejectedRequests();  // Lade die abgelehnten Anfragen
};
