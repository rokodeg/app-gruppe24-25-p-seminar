// Funktion zum Laden der Anfragen
function loadConfirmedRequests() {
  const confirmedRequests = JSON.parse(localStorage.getItem('confirmedRequests')) || [];
  const confirmedRequestsListContainer = document.getElementById('confirmedRequestsList');
  confirmedRequestsListContainer.innerHTML = '';

  if (confirmedRequests.length > 0) {
    confirmedRequests.forEach(function(anfrage) {
      const anfrageDiv = document.createElement('div');
      anfrageDiv.classList.add('anfrage-container');
      
      anfrageDiv.innerHTML = `
        <div class="anfrage">
          <h3>${anfrage.name}</h3>
          <p><strong>Fach:</strong> ${anfrage.fach}</p>
          <p><strong>Stundenanzahl:</strong> ${anfrage.stunden}</p>
          <p><strong>Klassenstufe:</strong> ${anfrage.klassenstufe}</p>
          <p><strong>Geschlecht:</strong> ${anfrage.geschlecht}</p>
          <p><strong>Zusätzliche Infos:</strong> ${anfrage.info || 'Keine zusätzlichen Infos'}</p>
          <button class="accept-button">Annehmen</button>
        </div>
      `;
      
      confirmedRequestsListContainer.appendChild(anfrageDiv);
    });
  } else {
    confirmedRequestsListContainer.innerHTML = '<p class="no-requests">Keine bestätigten Anfragen vorhanden.</p>';
  }
}

// Funktion zum Ein-/Ausklappen aller Filter
function toggleAllFilters() {
  const filterContents = document.querySelectorAll('.filter-container');
  const displayStyle = filterContents[0].style.display === 'block' ? 'none' : 'block';

  filterContents.forEach(function(content) {
    content.style.display = displayStyle;
  });
}

// Filterfunktion für Anfragen nach Fach, Geschlecht und Klassenstufe
function filterRequests() {
  const filterFach = document.getElementById('filterFach').value;
  const filterGeschlecht = document.getElementById('filterGeschlecht').value;
  const minKlassenstufe = document.getElementById('minKlassenstufe').value;
  const maxKlassenstufe = document.getElementById('maxKlassenstufe').value;

  const confirmedRequests = JSON.parse(localStorage.getItem('confirmedRequests')) || [];
  const confirmedRequestsListContainer = document.getElementById('confirmedRequestsList');
  confirmedRequestsListContainer.innerHTML = '';

  const filteredRequests = confirmedRequests.filter(function(anfrage) {
    let fachMatch = true;
    let geschlechtMatch = true;
    let klassenstufeMatch = true;

    // Fachfilter
    if (filterFach && anfrage.fach !== filterFach) {
      fachMatch = false;
    }

    // Geschlechtsfilter
    if (filterGeschlecht) {
      if (filterGeschlecht === "exclude_männlich" && anfrage.geschlecht === "männlich") {
        geschlechtMatch = false;
      }
      if (filterGeschlecht === "exclude_weiblich" && anfrage.geschlecht === "weiblich") {
        geschlechtMatch = false;
      }
      if (filterGeschlecht === "exclude_divers" && anfrage.geschlecht === "divers") {
        geschlechtMatch = false;
      }
      if (filterGeschlecht !== "exclude_männlich" && filterGeschlecht !== "exclude_weiblich" && filterGeschlecht !== "exclude_divers" && anfrage.geschlecht !== filterGeschlecht) {
        geschlechtMatch = false;
      }
    }

    // Klassenstufenfilter
    if (minKlassenstufe && anfrage.klassenstufe < minKlassenstufe) {
      klassenstufeMatch = false;
    }
    if (maxKlassenstufe && anfrage.klassenstufe > maxKlassenstufe) {
      klassenstufeMatch = false;
    }

    return fachMatch && geschlechtMatch && klassenstufeMatch;
  });

  if (filteredRequests.length > 0) {
    filteredRequests.forEach(function(anfrage) {
      const anfrageDiv = document.createElement('div');
      anfrageDiv.classList.add('anfrage-container');
      
      anfrageDiv.innerHTML = `
        <div class="anfrage">
          <h3>${anfrage.name}</h3>
          <p><strong>Fach:</strong> ${anfrage.fach}</p>
          <p><strong>Stundenanzahl:</strong> ${anfrage.stunden}</p>
          <p><strong>Klassenstufe:</strong> ${anfrage.klassenstufe}</p>
          <p><strong>Geschlecht:</strong> ${anfrage.geschlecht}</p>
          <p><strong>Zusätzliche Infos:</strong> ${anfrage.info || 'Keine zusätzlichen Infos'}</p>
          <button class="accept-button">Annehmen</button>
        </div>
      `;
      
      confirmedRequestsListContainer.appendChild(anfrageDiv);
    });
  } else {
    confirmedRequestsListContainer.innerHTML = '<p class="no-requests">Keine Anfragen, die deinen Kriterien entsprechen.</p>';
  }
}

window.onload = loadConfirmedRequests;