import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

cursor.execute("SELECT * FROM users;")
users = cursor.fetchall()

if users:
    for user in users:
        print(user)
else:
    print("Keine Benutzer gefunden.")

conn.close()