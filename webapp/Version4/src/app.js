const Database = require('better-sqlite3');
const db = new Database('nachhilfe_app.db');

// Tabellen erstellen
db.exec(`
  -- Benutzer-Tabelle für alle Arten von Benutzern
  CREATE TABLE IF NOT EXISTS benutzer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    benutzername TEXT UNIQUE NOT NULL,
    passwort TEXT NOT NULL,
    rolle TEXT NOT NULL CHECK(rolle IN ('nachhilfegebend', 'admin', 'schueler')),
    email TEXT UNIQUE,
    registriert_am DATETIME DEFAULT CURRENT_TIMESTAMP,
    letzter_login DATETIME
  );

  -- Tabelle für zusätzliche Details der Nachhilfegebenden
  CREATE TABLE IF NOT EXISTS nachhilfegebende (
    benutzer_id INTEGER PRIMARY KEY,
    vorname TEXT,
    nachname TEXT,
    faecher TEXT,
    beschreibung TEXT,
    stundensatz REAL,
    verfuegbarkeit TEXT,
    FOREIGN KEY (benutzer_id) REFERENCES benutzer(id)
  );

  -- Anfragen-Tabelle
  CREATE TABLE IF NOT EXISTS anfragen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    schueler_id INTEGER NOT NULL,
    nachhilfe_id INTEGER,
    fach TEXT NOT NULL,
    thema TEXT,
    beschreibung TEXT,
    gewuenschtes_datum DATE,
    gewuenschte_uhrzeit TIME,
    dauer INTEGER,
    status TEXT DEFAULT 'offen' CHECK(status IN ('offen', 'angenommen', 'abgelehnt', 'abgeschlossen')),
    erstellt_am DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schueler_id) REFERENCES benutzer(id),
    FOREIGN KEY (nachhilfe_id) REFERENCES benutzer(id)
  );

  -- Nachhilfe-Stunden-Tabelle für bestätigte Termine
  CREATE TABLE IF NOT EXISTS nachhilfestunden (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    anfrage_id INTEGER,
    schueler_id INTEGER NOT NULL,
    nachhilfe_id INTEGER NOT NULL,
    datum DATE NOT NULL,
    uhrzeit TIME NOT NULL,
    dauer INTEGER NOT NULL,
    fach TEXT NOT NULL,
    thema TEXT,
    status TEXT DEFAULT 'geplant' CHECK(status IN ('geplant', 'durchgeführt', 'ausgefallen')),
    notizen TEXT,
    FOREIGN KEY (anfrage_id) REFERENCES anfragen(id),
    FOREIGN KEY (schueler_id) REFERENCES benutzer(id),
    FOREIGN KEY (nachhilfe_id) REFERENCES benutzer(id)
  );

  -- Bewertungen-Tabelle
  CREATE TABLE IF NOT EXISTS bewertungen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nachhilfestunde_id INTEGER,
    schueler_id INTEGER NOT NULL,
    nachhilfe_id INTEGER NOT NULL,
    bewertung INTEGER CHECK(bewertung BETWEEN 1 AND 5),
    kommentar TEXT,
    erstellt_am DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nachhilfestunde_id) REFERENCES nachhilfestunden(id),
    FOREIGN KEY (schueler_id) REFERENCES benutzer(id),
    FOREIGN KEY (nachhilfe_id) REFERENCES benutzer(id)
  );
`);

console.log("Datenbank wurde erstellt und Tabellen wurden angelegt!");

// Benutzer erstellen
const erstelleBenutzer = db.prepare(`
    INSERT INTO benutzer (benutzername, passwort, rolle, email)
    VALUES (?, ?, ?, ?)
  `);
  
  // Admin hinzufügen
  function adminHinzufuegen(benutzername, passwort, email) {
    return erstelleBenutzer.run(benutzername, passwort, 'admin', email);
  }
  
  // Nachhilfegebenden hinzufügen
  const erstelleNachhilfegebenden = db.prepare(`
    INSERT INTO nachhilfegebende (benutzer_id, vorname, nachname, faecher, beschreibung, stundensatz, verfuegbarkeit)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  function nachhilfegebendenHinzufuegen(benutzername, passwort, email, vorname, nachname, faecher, beschreibung, stundensatz, verfuegbarkeit) {
    const benutzerInfo = erstelleBenutzer.run(benutzername, passwort, 'nachhilfegebend', email);
    const benutzerId = benutzerInfo.lastInsertRowid;
    return erstelleNachhilfegebenden.run(benutzerId, vorname, nachname, faecher, beschreibung, stundensatz, verfuegbarkeit);
  }
  
  // Anfrage erstellen
  const erstelleAnfrage = db.prepare(`
    INSERT INTO anfragen (schueler_id, fach, thema, beschreibung, gewuenschtes_datum, gewuenschte_uhrzeit, dauer)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Anfrage annehmen
  const anfrageAnnehmen = db.prepare(`
    UPDATE anfragen
    SET nachhilfe_id = ?, status = 'angenommen'
    WHERE id = ? AND status = 'offen'
  `);
  
  // Nachhilfestunde erstellen
  const erstelleNachhilfestunde = db.prepare(`
    INSERT INTO nachhilfestunden (anfrage_id, schueler_id, nachhilfe_id, datum, uhrzeit, dauer, fach, thema)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Beispielverwendung
  try {
    // Admin erstellen
    adminHinzufuegen('admin1', 'sicheresPasswort123', 'admin@schule.de');
    
    console.log("Datenbank wurde mit Beispieldaten befüllt!");
  } catch (err) {
    console.error("Fehler beim Befüllen der Datenbank:", err);
  } finally {
    // Datenbank-Verbindung schließen
    db.close();
  }

  
  
