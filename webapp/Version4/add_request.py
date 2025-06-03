import sqlite3

# Verbindung zur bestehenden Datenbank herstellen
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Beispiel-Daten für eine Anfrage (füge hier die assigned_user_id hinzu)
anfrage = {
    'id': 1,  # muss existieren!
    'name': 'Für  test',
    'fach': 'Mathematik',
    'stunden': 2,
    'klassenstufe': 9,
    'geschlecht': 'männlich',
    'anmerkungen': 'keine',
    'kontakt': 'max@example.com',
    'wohnort': 'Berlin',
    'status': 'neu',
    'assigned_user_id': None  # Hier kannst du den ID-Wert für den zugewiesenen Benutzer setzen, wenn nötig
}

# Anfrage einfügen (jetzt auch assigned_user_id berücksichtigen)
cursor.execute('''
INSERT INTO offers (id, name, fach, stunden, klassenstufe, geschlecht, anmerkungen, kontakt, wohnort, status, assigned_user_id)
VALUES (:id, :name, :fach, :stunden, :klassenstufe, :geschlecht, :anmerkungen, :kontakt, :wohnort, :status, :assigned_user_id)
''', anfrage)

# Änderungen speichern und Verbindung schließen
conn.commit()
conn.close()

print("Anfrage erfolgreich eingefügt.")
