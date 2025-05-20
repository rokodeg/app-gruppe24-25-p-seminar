import sqlite3

# Verbindung zur bestehenden Datenbank herstellen
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Beispiel-Daten für eine Anfrage
anfrage = {
    'user_id': 1,  # muss existieren!
    'name': 'Max Mustermann',
    'fach': 'Mathematik',
    'stunden': 2,
    'klassenstufe': 9,
    'geschlecht': 'männlich',
    'dringlichkeit': 'hoch',
    'kontakt': 'max@example.com',
    'wohnort': 'Berlin',
    'status': 'offen'
}

# Anfrage einfügen
cursor.execute('''
INSERT INTO offers (user_id, name, fach, stunden, klassenstufe, geschlecht, dringlichkeit, kontakt, wohnort, status)
VALUES (:user_id, :name, :fach, :stunden, :klassenstufe, :geschlecht, :dringlichkeit, :kontakt, :wohnort, :status)
''', anfrage)

# Änderungen speichern und Verbindung schließen
conn.commit()
conn.close()

print("Anfrage erfolgreich eingefügt.")
