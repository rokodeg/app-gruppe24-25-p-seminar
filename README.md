# App P-Seminar 24/25
leer
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Seite - Anfragen</title>
  <link rel="stylesheet" href="{{ url_for('static', filename='admin/style.css') }}">
  <style>
    /* Allgemeines Styling */
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .content-box {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    h1 {
      font-size: 28px;
      text-align: center;
      color: #333;
    }

    h2 {
      font-size: 24px;
      color: #333;
      margin-bottom: 10px;
    }

    .welcome-slogan {
      text-align: center;
      color: #555;
      margin-bottom: 30px;
      font-size: 16px;
    }

    .section {
      margin-bottom: 30px;
      padding: 20px;
      border-radius: 8px;
      background-color: #f9f9f9;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .section-title {
      font-size: 22px;
      color: #333;
      margin-bottom: 15px;
    }

    .form-container {
      margin-top: 20px;
      padding: 15px;
      background-color: #e9f7fa;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-container input,
    .form-container button {
      margin: 10px 0;
      padding: 10px;
      width: 100%;
      font-size: 16px;
    }

    .form-container input[type="checkbox"] {
      width: auto;
    }

    .form-container label {
      font-size: 16px;
      color: #333;
    }

    .request-card {
      border: 1px solid #ddd;
      margin: 10px 0;
      padding: 15px;
      border-radius: 8px;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .request-card p {
      margin: 5px 0;
    }

    .request-card form select {
      padding: 8px;
      width: 100%;
      font-size: 16px;
    }

    .request-card button {
      margin-top: 10px;
      padding: 10px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .request-card button:hover {
      background-color: #45a049;
    }

    .back-link,
    .impressum-link {
      text-align: center;
      margin-top: 20px;
    }

    .link-container {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
    }

    .link-container a {
      color: #007BFF;
      text-decoration: none;
    }

    .link-container a:hover {
      text-decoration: underline;
    }

    /* Styling für den ein- und ausklappbaren Bereich */
    #user-form-container {
      display: none;
    }

    .toggle-button {
      background-color: #007BFF;
      color: white;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      width: 100%;
    }

    .toggle-button:hover {
      background-color: #0056b3;
    }

    /* Benutzername-Verfügbarkeits-Feedback */
    .feedback {
      font-size: 14px;
      margin-top: 10px;
    }

    .available {
      color: green;
    }

    .unavailable {
      color: red;
    }

    .toggle-section {
  margin: 20px 0;
  text-align: center;
}

.toggle-section button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.anfrage-box {
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #ddd;
  max-width: 600px;
  background-color: #f9f9f9;
}

.logout-wrapper {
  display: flex;
  justify-content: flex-end;
}

.logout-button {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #333;
  position: relative;
  margin-top: 10px;
  margin-right: 10px;
}

.logout-button:hover::after {
  content: "Ausloggen";
  position: absolute;
  top: 50%;
  right: 110%;
  transform: translateY(-50%);
  background-color: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0.95;
  z-index: 10;
}
  </style>
</head>
<body>

  <div class="content-box">
    <div class="header-row">
  <div class="dashboard-title">
    <h1>Admin Dashboard</h1>
    <div class="welcome-slogan">Verwalten Sie Anfragen und Benutzer von hier aus!</div>
  </div>
  <div class="logout-wrapper">
    <form action="{{ url_for('logout') }}" method="post" title="Ausloggen">
      <button type="submit" class="logout-button" aria-label="Logout">
        ⎋
      </button>
    </form>
  </div>
</div>

    <!-- Neue Anfragen Abschnitt -->
    <div class="section">
      <h2 class="section-title">Neue Anfragen</h2>
      {% if neue_anfragen %}
          {% for anfrage in neue_anfragen %}
              <div class="request-card">
                  <p><strong>Name:</strong> {{ anfrage.name }}</p>
                  <p><strong>Fach:</strong> {{ anfrage.fach }}</p>
                  <p><strong>Stunden:</strong> {{ anfrage.stunden }}</p>
                  <p><strong>Status:</strong> {{ anfrage.status }}</p>

                  <form method="post" action="{{ url_for('update_anfrage_status') }}">
                      <input type="hidden" name="anfrage_id" value="{{ anfrage.id }}">
                      <select name="status">
                          <option value="offen">Annehmen</option>
                          <option value="abgelehnt">Ablehnen</option>
                      </select>
                      <button type="submit">Speichern</button>
                  </form>
              </div>
          {% endfor %}
      {% else %}
          <p>Keine neuen Anfragen vorhanden.</p>
      {% endif %}

    </div>

    <!-- Button für bestätigte Anfragen -->
<div class="toggle-section">
  <button onclick="toggleSection('confirmedSection')">Bisher bestätigte Anfragen</button>
  <div id="confirmedSection" style="display: none;">
    {% for anfrage in bestaetigte_anfragen %}
      <div class="anfrage-box">
        <h4>{{ anfrage.name }}</h4>
        <p><strong>Fach:</strong> {{ anfrage.fach }}</p>
        <p><strong>Klassenstufe:</strong> {{ anfrage.klassenstufe }}</p>
        <p><strong>Wohnort:</strong> {{ anfrage.wohnort }}</p>
      </div>
    {% else %}
      <p>Keine bestätigten Anfragen vorhanden.</p>
    {% endfor %}
  </div>
</div>

<!-- Button für abgelehnte Anfragen -->
<div class="toggle-section">
  <button onclick="toggleSection('rejectedSection')">Bisher abgelehnte Anfragen</button>
  <div id="rejectedSection" style="display: none;">
    {% for anfrage in abgelehnte_anfragen %}
      <div class="anfrage-box">
        <h4>{{ anfrage.name }}</h4>
        <p><strong>Fach:</strong> {{ anfrage.fach }}</p>
        <p><strong>Klassenstufe:</strong> {{ anfrage.klassenstufe }}</p>
        <p><strong>Wohnort:</strong> {{ anfrage.wohnort }}</p>
      </div>
    {% else %}
      <p>Keine abgelehnten Anfragen vorhanden.</p>
    {% endfor %}
  </div>
</div>


    <!-- Benutzer Hinzufügen Abschnitt -->
    <div class="section">
      <button class="toggle-button" onclick="toggleUserForm()">Neuen Benutzer hinzufügen</button>
      <div id="user-form-container" class="form-container">
        <form method="POST" action="{{ url_for('add_user') }}">
          <label for="username">Benutzername:</label>
          <input type="text" id="username" name="username" required>
          
          <!-- Feedback für den Benutzernamen -->
          <div id="username-feedback" class="feedback"></div>

          <label for="use_default_password">
            <input type="checkbox" id="use_default_password" name="use_default_password" checked>
            Standard-Passwort verwenden (Pa$$w0rd)
          </label>

          <div id="password-container" style="display: none;">
            <label for="password">Neues Passwort:</label>
            <input type="password" id="password" name="password" placeholder="Passwort eingeben">
          </div>

          <button type="submit" id="submit-button" disabled>Benutzer hinzufügen</button>
        </form>
      </div>
    </div>


    <div class="link-container">
      <p><a href="index.html">Zurück zur Startseite</a> | <a href="impressum.html">Impressum</a></p>
    </div>
  </div>

  <script src="{{ url_for('static', filename='admin/script.js') }}"></script>
  <script>
    // JavaScript für den ein- und ausklappbaren Bereich
    function toggleUserForm() {
      const formContainer = document.getElementById('user-form-container');
      if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
      } else {
        formContainer.style.display = 'none';
      }
    }

    // JavaScript zum Umschalten des Passwortfeldes
    const passwordCheckbox = document.getElementById('use_default_password');
    const passwordContainer = document.getElementById('password-container');
    
    passwordCheckbox.addEventListener('change', () => {
      if (passwordCheckbox.checked) {
        passwordContainer.style.display = 'none';
      } else {
        passwordContainer.style.display = 'block';
      }
    });

    // Funktion zur Prüfung der Verfügbarkeit des Benutzernamens
    document.getElementById('username').addEventListener('input', function() {
      const username = this.value;
      const feedback = document.getElementById('username-feedback');
      const submitButton = document.getElementById('submit-button');

      if (username.length >= 3) { // Nur ab 3 Zeichen prüfen
        fetch(`/check_username?username=${username}`)
          .then(response => response.json())
          .then(data => {
            if (data.available) {
              feedback.textContent = 'Benutzername ist verfügbar!';
              feedback.className = 'feedback available';
              submitButton.disabled = false; // Button aktivieren
            } else {
              feedback.textContent = 'Benutzername ist bereits vergeben.';
              feedback.className = 'feedback unavailable';
              submitButton.disabled = true; // Button deaktivieren
            }
          });
      } else {
        feedback.textContent = '';
        submitButton.disabled = true; // Button deaktivieren
      }
    });

    function toggleSection(id) {
    const element = document.getElementById(id);
    if (element.style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }
  </script>
</body>
</html>
