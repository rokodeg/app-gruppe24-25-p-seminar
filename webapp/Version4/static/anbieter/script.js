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
  tag.innerHTML = `${value} <span style="cursor:pointer; margin-left:5px;" onclick="this.parentElement.remove(); filterRequests();">×</span>`;
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

function syncFaecher() {
  const tags = document.querySelectorAll('.fach-tag');
  const faecher = Array.from(tags).map(tag => tag.dataset.fach);
  document.getElementById('hiddenFaecher').value = faecher.join(',');
}

document.addEventListener('DOMContentLoaded', function () {

  updateCharCount();

  const plusBtn = document.getElementById('fachPlusBtn');
  const dropdown = document.getElementById('fachDropdown');
  const gewaehlteFaecher = document.getElementById('gewaehlteFaecher');

  const filterToggleBtn = document.querySelector('.btn-toggle-filter');
  const filterBereich = document.getElementById('filterBereich');

  const filterFachPlusBtn = document.getElementById('filterFachPlusBtn');
  const filterFachDropdownWrapper = document.getElementById('filterFachDropdownWrapper');
  const filterFachDropdown = document.getElementById('filterFachDropdown');
  const filterFaecherTags = document.getElementById('filterFaecherTags');

  const filterGeschlechtPlusBtn = document.getElementById('filterGeschlechtPlusBtn');
  const filterGeschlechtDropdownWrapper = document.getElementById('filterGeschlechtDropdownWrapper');
  const filterGeschlechtDropdown = document.getElementById('filterGeschlechtDropdown');
  const filterGeschlechtTags = document.getElementById('filterGeschlechtTags');
   const minKlasse = document.getElementById("minKlasse");
  const maxKlasse = document.getElementById("maxKlasse");

if (minKlasse) minKlasse.addEventListener("input", filterRequests);
  if (maxKlasse) maxKlasse.addEventListener("input", filterRequests);
const sortSelect = document.getElementById("sortierung");
  if (sortSelect) sortSelect.addEventListener("change", filterRequests);
  
  if (plusBtn && dropdown && gewaehlteFaecher) {
    plusBtn.addEventListener('click', () => {
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      if (dropdown.style.display === 'block') dropdown.focus();
    });

    dropdown.addEventListener('change', function () {
      const fach = this.value;
      if (!fach) return;

      const vorhandene = Array.from(document.querySelectorAll('.fach-tag')).map(el => el.dataset.fach);
      if (vorhandene.includes(fach)) return;

      const tag = document.createElement('div');
      tag.className = 'fach-tag';
      tag.dataset.fach = fach;
      tag.innerHTML = `${fach} <span class="remove-fach" onclick="this.parentElement.remove()">×</span>`;
      gewaehlteFaecher.appendChild(tag);

      this.value = '';
      this.style.display = 'none';
    });
  }

  if (filterToggleBtn && filterBereich) {
    filterToggleBtn.addEventListener('click', function () {
      const isVisible = filterBereich.style.display === 'block' || filterBereich.style.display === '';
      filterBereich.style.display = isVisible ? 'none' : 'block';
      filterToggleBtn.textContent = isVisible ? 'Filter anzeigen' : 'Filter ausblenden';
    });
  }

  if (filterFachPlusBtn && filterFachDropdownWrapper) {
    filterFachPlusBtn.addEventListener('click', () => {
      const isVisible = filterFachDropdownWrapper.style.display === 'block';
      filterFachDropdownWrapper.style.display = isVisible ? 'none' : 'block';
    });
  }

  if (filterFachDropdown) {
    filterFachDropdown.addEventListener('change', function () {
      addFilterTag(this, 'filterFaecherTags');
    });
  }

  if (filterGeschlechtPlusBtn && filterGeschlechtDropdownWrapper) {
    filterGeschlechtPlusBtn.addEventListener('click', () => {
      const isVisible = filterGeschlechtDropdownWrapper.style.display === 'block';
      filterGeschlechtDropdownWrapper.style.display = isVisible ? 'none' : 'block';
    });
  }

  if (filterGeschlechtDropdown) {
    filterGeschlechtDropdown.addEventListener('change', function () {
      addFilterTag(this, 'filterGeschlechtTags');
    });
  }

});
