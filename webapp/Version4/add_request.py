import sqlite3
from datetime import datetime, timedelta

def get_db_connection():
    conn = sqlite3.connect('database.db')  # Pfad anpassen!
    return conn

def insert_test_data():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Beispiel-Daten für 10 Anfragen
    for i in range(1, 11):
        name = f"Testkunde {i}"
        fach = f"Fach {i%5 + 1}"  # z.B. Fach 1 bis Fach 5
        stunden = (i % 4) + 1
        klassenstufe = 5 + (i % 6)  # 5 bis 10
        geschlecht = "m" if i % 2 == 0 else "w"
        anmerkungen = f"Anmerkung für Anfrage {i}"
        kontakt = f"kontakt{i}@example.com"
        wohnort = f"Ort {i}"
        status = "neu"
        assigned_user_id = None  # noch keiner zugewiesen
        created_at = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d %H:%M:%S")
        hidden_for_user_ids = None  # falls Feld vorhanden

        cursor.execute("""
            INSERT INTO offers (name, fach, stunden, klassenstufe, geschlecht, anmerkungen, kontakt, wohnort, status, assigned_user_id, created_at, hidden_for_user_ids)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, fach, stunden, klassenstufe, geschlecht, anmerkungen, kontakt, wohnort, status, assigned_user_id, created_at, hidden_for_user_ids))

    conn.commit()
    conn.close()
    print("10 Testanfragen wurden eingefügt.")

if __name__ == "__main__":
    insert_test_data()
