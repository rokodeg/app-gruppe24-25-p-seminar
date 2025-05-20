import sqlite3
from werkzeug.security import generate_password_hash

# Verbindung zur Datenbank herstellen
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Testbenutzerdaten
username = 'admin'
password = 'admin100admin'
hashed_password = generate_password_hash(password)

try:
    # Benutzer in die Datenbank einfügen
    cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
    conn.commit()
    print(f"Benutzer '{username}' wurde erfolgreich hinzugefügt.")
except sqlite3.IntegrityError:
    print(f"Benutzername '{username}' ist bereits vergeben.")
finally:
    conn.close()
