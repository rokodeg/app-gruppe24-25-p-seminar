function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  if (!dropdown) return;

  // Optional: andere Dropdowns schließen
  document.querySelectorAll('.dropdown-wrapper').forEach(d => d.style.display = "none");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function addFilterTag(select, containerId) {
  const value = select.value;
  if (!value) return;

  const container = document.getElementById(containerId);
  const existing = Array.from(container.children).map(tag => tag.dataset.value);
  if (existing.includes(value)) {
    select.value = "";
    return;
  }

  const tag = document.createElement("div");
  tag.className = "fach-tag";
  tag.dataset.value = value;
  tag.innerHTML = `${value} <span style="cursor:pointer; margin-left:5px;" class="remove-fach" onclick="this.parentElement.remove(); filterRequests();">×</span>`;
  container.appendChild(tag);

  select.value = "";
  if (select.parentElement) select.parentElement.style.display = "none";

  filterRequests(); // Sofort anwenden
}

function getTagValues(containerId) {
  const container = document.getElementById(containerId);
  return Array.from(container.children).map(tag => tag.dataset.value.toLowerCase());
}

function filterRequests() {
  const fachFilter = getTagValues("filterFaecherTags");
  const geschlechtFilter = getTagValues("filterGeschlechtTags");
  const minKlasse = parseInt(document.getElementById("minKlasse").value);
  const maxKlasse = parseInt(document.getElementById("maxKlasse").value);
  const sortierung = document.getElementById("sortierung").value;

  const container = document.getElementById('confirmedRequestsList');
  let anfragen = Array.from(container.querySelectorAll('.anfrage-container'));

  anfragen.forEach(item => {
    const fach = item.dataset.fach?.toLowerCase();
    const geschlecht = item.dataset.geschlecht?.toLowerCase();
    const klasse = parseInt(item.dataset.klassenstufe);
    let visible = true;

    if (fachFilter.length > 0 && !fachFilter.includes(fach)) visible = false;
    if (geschlechtFilter.length > 0 && !geschlechtFilter.includes(geschlecht)) visible = false;
    if (!isNaN(minKlasse) && klasse < minKlasse) visible = false;
    if (!isNaN(maxKlasse) && klasse > maxKlasse) visible = false;

    item.style.display = visible ? "block" : "none";
  });

  // Sortieren
  anfragen = anfragen.filter(el => el.style.display !== "none");
  anfragen.sort((a, b) => {
    const dateA = new Date(a.dataset.created);
    const dateB = new Date(b.dataset.created);
    return sortierung === "neueste" ? dateB - dateA : dateA - dateB;
  });
  anfragen.forEach(el => container.appendChild(el));
}

function toggleAcceptedList() {
  const list = document.getElementById('acceptedRequestsList');
  list.style.display = list.style.display === 'none' ? 'block' : 'none';
}

function toggleCompletedList() {
  const list = document.getElementById('completedRequestsList');
  list.style.display = list.style.display === 'none' ? 'block' : 'none';
}

function openPopup() {
  document.getElementById('popupModal').style.display = 'flex';
}

function closePopup() {
  document.getElementById('popupModal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('popupModal');
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

function updateCharCount() {
  const textarea = document.getElementById('kommentar');
  const charCount = document.getElementById('charCount');
  if (!textarea || !charCount) return;

  const remaining = 100 - textarea.value.length;
  charCount.textContent = `${remaining} Zeichen übrig`;
}

function syncFaecher(event) {
  event.preventDefault(); // damit du erstmal testen kannst, sonst Formular absenden

  const container = document.getElementById('gewaehlteFaecher');
  const hiddenInput = document.getElementById('hiddenFaecher');

  // Alle ausgewählten Fächer sammeln
  const faecher = Array.from(container.querySelectorAll('.fach-tag'))
                      .map(tag => tag.dataset.value)
                      .filter(Boolean);

  // Setze Wert im versteckten Feld als CSV oder JSON (je nachdem, was dein Backend erwartet)
  hiddenInput.value = faecher.join(',');

  // Jetzt Formular abschicken
  event.target.submit();
}

document.addEventListener('DOMContentLoaded', function () {
  // Entfernen-Listener für schon vorhandene Tags setzen (oben)
  document.querySelectorAll('#gewaehlteFaecher .remove-fach').forEach(removeBtn => {
    removeBtn.addEventListener('click', function () {
      const tag = this.parentElement;
      const value = tag.dataset.value;
      tag.remove();

      // Dropdown-Item (unterricht) wieder sichtbar machen
      if (value) {
        document.querySelectorAll('#unterrichtFachDropdownList li').forEach(li => {
          if (li.dataset.value === value) {
            li.style.display = '';
          }
        });
      }
    });
  });

  // Alle aktuell oben ausgewählten Fächer holen
  const ausgewaehlteFaecher = Array.from(document.querySelectorAll('#gewaehlteFaecher .fach-tag'))
    .map(tag => tag.dataset.value);

  const unterrichtFachDropdownList = document.getElementById('unterrichtFachDropdownList');

  // Unterricht Dropdown Items für oben ausgewählte Fächer ausblenden
  if (unterrichtFachDropdownList) {
    ausgewaehlteFaecher.forEach(fach => {
      [...unterrichtFachDropdownList.children].forEach(li => {
        if (li.dataset.value === fach) {
          li.style.display = 'none';
        }
      });
    });
  }

  // --- NEU: Die Fächer auch im Filterbereich als Tags hinzufügen ---
  const filterFaecherTags = document.getElementById('filterFaecherTags');
  const filterFachDropdownList = document.getElementById('filterFachDropdownList');

  if (filterFaecherTags && filterFachDropdownList) {
    ausgewaehlteFaecher.forEach(fach => {
      // Prüfen, ob Tag schon da ist
      if (!Array.from(filterFaecherTags.querySelectorAll('.fach-tag')).some(t => t.dataset.value === fach)) {
        const tag = document.createElement('div');
        tag.className = 'fach-tag';
        tag.dataset.value = fach;
        tag.innerHTML = `${fach} <span class="remove-fach" style="cursor:pointer;">×</span>`;
        filterFaecherTags.appendChild(tag);

        // Entfernen-Listener im Filterbereich
        tag.querySelector('.remove-fach').addEventListener('click', () => {
          tag.remove();
          // Dropdown-Item im Filter wieder anzeigen
          [...filterFachDropdownList.children].forEach(li => {
            if (li.dataset.value === fach) li.style.display = '';
          });
        });

        // Dropdown-Item im Filter ausblenden
        [...filterFachDropdownList.children].forEach(li => {
          if (li.dataset.value === fach) li.style.display = 'none';
        });
      }
    });
  }

  updateCharCount();

  // ... Rest deines Codes (Event Listener für Buttons, Filter etc.) unverändert ...

  const filterFachPlusBtn = document.getElementById('filterFachPlusBtn');
  const filterFachDropdownWrapper = document.getElementById('filterFachDropdownWrapper');
  const filterGeschlechtPlusBtn = document.getElementById('filterGeschlechtPlusBtn');
  const filterGeschlechtDropdownWrapper = document.getElementById('filterGeschlechtDropdownWrapper');
  const filterGeschlechtDropdownList = document.getElementById('filterGeschlechtDropdownList');
  const filterGeschlechtTags = document.getElementById('filterGeschlechtTags');
  const unterrichtFachPlusBtn = document.getElementById('unterrichtFachPlusBtn');
  const unterrichtFachDropdownWrapper = document.getElementById('unterrichtFachDropdownWrapper');
  const unterrichtFachTags = document.getElementById('gewaehlteFaecher');
  const filterToggleBtn = document.querySelector('.btn-toggle-filter');
  const filterBereich = document.getElementById('filterBereich');
  const minKlasse = document.getElementById("minKlasse");
  const maxKlasse = document.getElementById("maxKlasse");
  const sortSelect = document.getElementById("sortierung");

  if (minKlasse) minKlasse.addEventListener("input", filterRequests);
  if (maxKlasse) maxKlasse.addEventListener("input", filterRequests);
  if (sortSelect) sortSelect.addEventListener("change", filterRequests);

  function hideAllDropdowns() {
    document.querySelectorAll('.dropdown-wrapper').forEach(d => d.style.display = 'none');
  }

  function addTag(container, value) {
    if (!value) return;
    const vorhandene = Array.from(container.querySelectorAll('.fach-tag')).map(el => el.dataset.value);
    if (vorhandene.includes(value)) return;

    const tag = document.createElement('div');
    tag.className = 'fach-tag';
    tag.dataset.value = value;
    tag.innerHTML = `${value} <span class="remove-fach" style="cursor:pointer;">×</span>`;
    container.appendChild(tag);

    tag.querySelector('.remove-fach').addEventListener('click', () => {
      tag.remove();
      restoreDropdownItem(value);
    });
  }

  function restoreDropdownItem(value) {
    if (filterFachDropdownList) {
      [...filterFachDropdownList.children].forEach(li => {
        if (li.dataset.value === value) li.style.display = '';
      });
    }
    if (filterGeschlechtDropdownList) {
      [...filterGeschlechtDropdownList.children].forEach(li => {
        if (li.dataset.value === value) li.style.display = '';
      });
    }
    if (unterrichtFachDropdownList) {
      [...unterrichtFachDropdownList.children].forEach(li => {
        if (li.dataset.value === value) li.style.display = '';
      });
    }
  }

  function hideDropdownItem(value, dropdownList) {
    if (!dropdownList) return;
    [...dropdownList.children].forEach(li => {
      if (li.dataset.value === value) li.style.display = 'none';
    });
  }

  // --- Filter-Fächer ---
if (filterFachPlusBtn && filterFachDropdownWrapper && filterFachDropdownList && filterFaecherTags) {
  filterFachPlusBtn.addEventListener('click', e => {
    e.stopPropagation();

    // Zustand vorher abfragen, bevor alle Dropdowns geschlossen werden
    const isVisible = window.getComputedStyle(filterFachDropdownWrapper).display === 'block';

    // Alle Dropdowns schließen, aber den eigenen offen lassen (wenn er vorher offen war)
    hideAllDropdowns(filterFachDropdownWrapper);

    // Toggle den Dropdown: Wenn vorher zugeklappt, öffne ihn, sonst zu
    filterFachDropdownWrapper.style.display = isVisible ? 'none' : 'block';
  });

  filterFachDropdownList.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      const value = li.dataset.value;
      if (!value) return;
      addTag(filterFaecherTags, value);
      hideDropdownItem(value, filterFachDropdownList);
      hideAllDropdowns();
    });
  });
}


  // --- Filter-Geschlecht ---
  if (filterGeschlechtPlusBtn && filterGeschlechtDropdownWrapper && filterGeschlechtDropdownList && filterGeschlechtTags) {
    filterGeschlechtPlusBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isVisible = filterGeschlechtDropdownWrapper.style.display === 'block';
      hideAllDropdowns();
      filterGeschlechtDropdownWrapper.style.display = isVisible ? 'none' : 'block';
    });

    filterGeschlechtDropdownList.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        const value = li.dataset.value;
        if (!value) return;
        addTag(filterGeschlechtTags, value);
        hideDropdownItem(value, filterGeschlechtDropdownList);
        hideAllDropdowns();
      });
    });
  }

  // --- Unterrichtbare Fächer ---
  if (unterrichtFachPlusBtn && unterrichtFachDropdownWrapper && unterrichtFachDropdownList && unterrichtFachTags) {
 unterrichtFachPlusBtn.addEventListener('click', e => {
  e.stopPropagation();
  const isVisible = unterrichtFachDropdownWrapper.style.display === 'block';

  // Dropdown schließen falls offen
  if (isVisible) {
    unterrichtFachDropdownWrapper.style.display = 'none';
  } else {
    // Dropdown Breite auf Button setzen
    const btnWidth = unterrichtFachPlusBtn.offsetWidth;
    unterrichtFachDropdownWrapper.style.width = btnWidth + 'px';

    // Dropdown anzeigen
    unterrichtFachDropdownWrapper.style.display = 'block';
  }
});

    unterrichtFachDropdownList.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        const value = li.dataset.value;
        if (!value) return;
        addTag(unterrichtFachTags, value);
        hideDropdownItem(value, unterrichtFachDropdownList);
        hideAllDropdowns();
      });
    });
  }

  // --- Alle Dropdowns schließen beim Klicken außerhalb ---
  document.addEventListener('click', () => {
    hideAllDropdowns();
  });

  // --- Filterbereich ein-/ausblenden ---
  if (filterToggleBtn && filterBereich) {
    filterToggleBtn.addEventListener('click', function () {
      const isVisible = filterBereich.style.display === 'block' || filterBereich.style.display === '';
      filterBereich.style.display = isVisible ? 'none' : 'block';
      filterToggleBtn.textContent = isVisible ? 'Filter anzeigen' : 'Filter ausblenden';
    });
  }
});












