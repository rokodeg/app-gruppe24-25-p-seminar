import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, session, url_for

# Initialisiere und erstelle Datenbanktabellen
conn = sqlite3.connect('database.db')
c = conn.cursor()

# Tabelle für Benutzer
c.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
''')

# Tabelle für Nachhilfeangebote
c.execute('''
CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    fach TEXT NOT NULL,
    stunden INTEGER,
    klassenstufe INTEGER,
    geschlecht TEXT,
    dringlichkeit TEXT,
    kontakt TEXT,
    wohnort TEXT,
    status TEXT DEFAULT 'offen'
    )
''')

conn.commit()
conn.close()

# Flask App Setup
app = Flask(__name__)
app.secret_key = 'dein_geheimer_schlüssel'

# Datenbankverbindung mit Row-Factory
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Startseite
@app.route("/")
def home():
    return render_template('index.html')

# Registrierung
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = generate_password_hash(request.form['password'])
        conn = get_db_connection()
        try:
            conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
            conn.commit()
        except sqlite3.IntegrityError:
            return 'Benutzername bereits vergeben.'
        finally:
            conn.close()
        return redirect('/login')
    return render_template('register.html')

# Login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']  # <--- Benutzername speichern
            return redirect('/anbieter')
        else:
            return 'Ungültige Anmeldedaten.'
    return render_template('login.html')

# Anbieter-Dashboard mit Anfragen
@app.route('/anbieter')
def anbieter():
    if 'user_id' not in session or 'username' not in session:
        return redirect(url_for('login'))

    # Admin-Check über den Benutzernamen
    if session['username'] == 'admin':
        return redirect(url_for('admin_dashboard'))

    # Normale Anbieter-Logik
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, fach, stunden, klassenstufe, geschlecht, dringlichkeit, kontakt, wohnort, status
        FROM offers
        WHERE status = 'offen'
    """)

    anfragen = cursor.fetchall()
    conn.close()

    anfrage_liste = []
    for row in anfragen:
        anfrage_liste.append({
            'id': row[0],
            'name': row[1],
            'fach': row[2],
            'stunden': row[3],
            'klassenstufe': row[4],
            'geschlecht': row[5],
            'dringlichkeit': row[6],
            'kontakt': row[7],
            'wohnort': row[8],
            'status': row[9]
        })

    return render_template('anbieter.html', anfragen=anfrage_liste)

@app.route('/admin')
def admin_dashboard():
    if 'username' in session and session['username'] == 'admin':
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM offers")
        anfragen = cursor.fetchall()
        conn.close()

        return render_template('admin.html', anfragen=anfragen)
    else:
        return redirect(url_for('login'))

# Anfrageformular
@app.route('/anfrage', methods=['GET', 'POST'])
def create_offer():
    
    if request.method == 'POST':
        fach = request.form['fach']
        name = request.form.get('name', '')
        stunden = request.form.get('stunden', 1)
        klassenstufe = request.form.get('klassenstufe', '')
        geschlecht = request.form.get('geschlecht', '')
        dringlichkeit = request.form.get('dringlichkeit', '')
        kontakt = request.form.get('kontakt', '')
        wohnort = request.form.get('wohnort', '')

        conn = get_db_connection()
        conn.execute('''
            INSERT INTO offers (name, fach, stunden, klassenstufe, geschlecht, dringlichkeit, kontakt, wohnort)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, fach, stunden, klassenstufe, geschlecht, dringlichkeit, kontakt, wohnort))
        conn.commit()
        conn.close()
        return redirect('/')
    return render_template('anfrage.html')

# Öffentliche Angebotsliste
#@app.route('/offers')
#def offers():
#   conn = get_db_connection()
#   offers = conn.execute('SELECT id, fach, beschreibung FROM offers WHERE status = "offen"').fetchall()
#   conn.close()
#   return render_template('offers.html', offers=offers)

# Anfrage annehmen
@app.route('/anfrage_annehmen', methods=['POST'])
def anfrage_annehmen():
    anfrage_id = request.form.get('anfrage_id')
    conn = get_db_connection()
    conn.execute('UPDATE offers SET status = ? WHERE id = ?', ('angenommen', anfrage_id))
    conn.commit()
    conn.close()
    return redirect(url_for('anbieter'))

@app.route('/settings', methods=['GET', 'POST'])
def change_password():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        password = request.form['password']
        confirm = request.form['confirmPassword']

        if password != confirm:
            return "Die Passwörter stimmen nicht überein.", 400

        hashed_password = generate_password_hash(password)
        conn = get_db_connection()
        conn.execute('UPDATE users SET password = ? WHERE id = ?', (hashed_password, session['user_id']))
        conn.commit()
        conn.close()

        return redirect(url_for('change_password', success='1'))
        #return redirect(url_for('anbieter'))  # oder zeige "Erfolg"

    return render_template('usersettings.html')


# Starte die App
if __name__ == '__main__':
    app.run(debug=True)