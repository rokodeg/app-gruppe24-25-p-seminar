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
  const filterFach = document.getElementById('filterFach').value.toLowerCase();
  const filterGeschlecht = document.getElementById('filterGeschlecht').value.toLowerCase();
  const minKlassenstufe = parseInt(document.getElementById('minKlassenstufe').value);
  const maxKlassenstufe = parseInt(document.getElementById('maxKlassenstufe').value);

  const anfragen = document.querySelectorAll('.anfrage-container');

  anfragen.forEach(container => {
    const text = container.textContent.toLowerCase();
    const klassenstufeMatch = text.match(/klassenstufe:\D*(\d+)/i);
    const klassenstufe = klassenstufeMatch ? parseInt(klassenstufeMatch[1]) : null;

    let sichtbar = true;

    // Fachfilter
    if (filterFach && !text.includes(filterFach)) sichtbar = false;

    // Geschlechtsfilter (inkl. exclude-Optionen)
    if (filterGeschlecht.startsWith('exclude_')) {
      const auszuschließen = filterGeschlecht.replace('exclude_', '');
      if (text.includes(auszuschließen)) sichtbar = false;
    } else if (filterGeschlecht && !text.includes(filterGeschlecht)) {
      sichtbar = false;
    }

    // Klassenstufenfilter
    if (!isNaN(minKlassenstufe) && (klassenstufe === null || klassenstufe < minKlassenstufe)) sichtbar = false;
    if (!isNaN(maxKlassenstufe) && (klassenstufe === null || klassenstufe > maxKlassenstufe)) sichtbar = false;

    container.style.display = sichtbar ? 'block' : 'none';
  });
}

window.onload = function () {
  filterRequests(); // Optional: Filter direkt beim Laden anwenden
};