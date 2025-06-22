import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, session, url_for, jsonify, flash, get_flashed_messages
from datetime import datetime

# Initialisiere und erstelle Datenbanktabellen
conn = sqlite3.connect('database.db')
c = conn.cursor()

# Benutzer-Tabelle
c.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    status TEXT,
    faecher TEXT, 
    jahrgang INTEGER
)
''')

# Angebote-Tabelle
c.execute('''
CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    fach TEXT NOT NULL,
    stunden INTEGER,
    klassenstufe INTEGER,
    geschlecht TEXT,
    anmerkungen TEXT,
    kontakt TEXT,
    wohnort TEXT,
    status TEXT DEFAULT 'neu',
    assigned_user_id INTEGER,
    user_comment TEXT,
    created_at TEXT
)
''')

conn.commit()
conn.close()

app = Flask(__name__)
app.secret_key = 'dein_geheimer_schlüssel'

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def home():
    messages = get_flashed_messages()
    message = messages[0] if messages else None
    return render_template('index.html', message=message)

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
            return render_template('register.html', message='Benutzername bereits vergeben.', username=username)
        finally:
            conn.close()
        return redirect('/login')
    return render_template('register.html')

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
            session['username'] = user['username']
            return redirect('/anbieter')
        else:
            return render_template('login.html', message='Ungültige Anmeldedaten.')
    return render_template('login.html')

@app.route('/anbieter')
def anbieter():
    if 'user_id' not in session or 'username' not in session:
        return redirect(url_for('login'))

    if session['username'] == 'admin':
        return redirect(url_for('admin_dashboard'))

    conn = get_db_connection()
    cursor = conn.cursor()

    # Nutzerbezogene Einstellungen abrufen
    user_data = conn.execute('SELECT status, faecher, jahrgang FROM users WHERE id = ?', (session['user_id'],)).fetchone()
    anbieter_status = user_data['status']
    anbieter_faecher = user_data['faecher'].split(',') if user_data['faecher'] else []
    anbieter_jahrgang = user_data['jahrgang']

    # Offene oder zugewiesene Anfragen
    cursor.execute("""
        SELECT id, name, fach, stunden, klassenstufe, geschlecht, anmerkungen, kontakt, wohnort, status, assigned_user_id, created_at
        FROM offers
        WHERE (status = 'offen' OR status = 'zugewiesen')
          AND (assigned_user_id IS NULL OR assigned_user_id = ?)
    """, (session['user_id'],))
    offene_und_zugewiesene = cursor.fetchall()

    # Angenommene Anfragen
    cursor.execute("""
        SELECT id, name, fach, stunden, klassenstufe, geschlecht, anmerkungen, kontakt, wohnort, status, assigned_user_id, created_at
        FROM offers
        WHERE status = 'angenommen' AND assigned_user_id = ?
    """, (session['user_id'],))
    angenommene_anfragen_raw = cursor.fetchall()

    # Erledigte Anfragen
    cursor.execute("""
        SELECT id, name, fach, stunden, klassenstufe, geschlecht, anmerkungen, kontakt, wohnort, status, assigned_user_id, created_at
        FROM offers
        WHERE status = 'erledigt' AND assigned_user_id = ?
    """, (session['user_id'],))
    erledigte_anfragen_raw = cursor.fetchall()

    conn.close()

    anfrage_liste = []
    zugewiesene_anfrage = None

    for row in offene_und_zugewiesene:
        anfrage = {
            'id': row[0],
            'name': row[1],
            'fach': row[2],
            'stunden': row[3],
            'klassenstufe': row[4],
            'geschlecht': row[5],
            'anmerkungen': row[6],
            'kontakt': row[7],
            'wohnort': row[8],
            'status': row[9],
            'assigned_user_id': row[10],
            'created_at': row[11]
        }

        if anfrage['assigned_user_id'] == session['user_id'] and anfrage['status'] == 'zugewiesen':
            zugewiesene_anfrage = anfrage
        else:
            anfrage_liste.append(anfrage)

    angenommene_anfragen = []
    for row in angenommene_anfragen_raw:
        anfrage = {
            'id': row[0],
            'name': row[1],
            'fach': row[2],
            'stunden': row[3],
            'klassenstufe': row[4],
            'geschlecht': row[5],
            'anmerkungen': row[6],
            'kontakt': row[7],
            'wohnort': row[8],
            'status': row[9],
            'assigned_user_id': row[10],
            'created_at': row[11]
        }
        angenommene_anfragen.append(anfrage)

    erledigte_anfragen = []
    for row in erledigte_anfragen_raw:
        anfrage = {
            'id': row[0],
            'name': row[1],
            'fach': row[2],
            'stunden': row[3],
            'klassenstufe': row[4],
            'geschlecht': row[5],
            'anmerkungen': row[6],
            'kontakt': row[7],
            'wohnort': row[8],
            'status': row[9],
            'assigned_user_id': row[10],
            'created_at': row[11]
        }
        erledigte_anfragen.append(anfrage)


    return render_template(
        'anbieter.html',
        anfragen=anfrage_liste,
        zugewiesene_anfrage=zugewiesene_anfrage,
        angenommene_anfragen=angenommene_anfragen,
        erledigte_anfragen=erledigte_anfragen,
        status=anbieter_status,
        ausgewaehlte_faecher=anbieter_faecher,
        user_jahrgang=anbieter_jahrgang
    )




@app.route('/admin')
def admin_dashboard():
    if 'username' in session and session['username'] == 'admin':
        conn = get_db_connection()

        neue_anfragen = conn.execute('''
            SELECT offers.*, offers.created_at, users.username AS assigned_user
            FROM offers
            LEFT JOIN users ON offers.assigned_user_id = users.id
            WHERE offers.status = 'neu' OR offers.status = 'zurückgezogen'
            ORDER BY offers.created_at DESC
        ''').fetchall()

        bestaetigte_anfragen = conn.execute('''
            SELECT offers.*, offers.created_at, users.username AS assigned_user
            FROM offers
            LEFT JOIN users ON offers.assigned_user_id = users.id
            WHERE offers.status = 'offen'
            ORDER BY offers.created_at DESC
        ''').fetchall()

        abgelehnte_anfragen = conn.execute('''
            SELECT offers.*, offers.created_at, users.username AS assigned_user
            FROM offers
            LEFT JOIN users ON offers.assigned_user_id = users.id
            WHERE offers.status = 'abgelehnt'
            ORDER BY offers.created_at DESC
        ''').fetchall()

        erledigte_anfragen = conn.execute('''
            SELECT offers.*, offers.created_at, users.username AS assigned_user
            FROM offers
            LEFT JOIN users ON offers.assigned_user_id = users.id
            WHERE offers.status = 'erledigt'
            ORDER BY offers.created_at DESC
        ''').fetchall()

        zugewiesene_anfragen = conn.execute('''
            SELECT offers.*, users.username AS assigned_user
            FROM offers
            LEFT JOIN users ON offers.assigned_user_id = users.id
            WHERE offers.status = 'zugewiesen'
            ORDER BY offers.created_at DESC
        ''').fetchall()

        abgelehnte_von_user = conn.execute('''
            SELECT offers.*, offers.created_at, users.username AS assigned_user
            FROM offers
            JOIN users ON offers.assigned_user_id = users.id
            WHERE offers.status = 'abgelehnt_von_user'
            ORDER BY offers.created_at DESC
        ''').fetchall()

        aktive_anfragen = conn.execute('''
            SELECT offers.*, offers.created_at, users.username AS assigned_user
            FROM offers
            LEFT JOIN users ON offers.assigned_user_id = users.id
            WHERE offers.status IN ('offen', 'zugewiesen', 'angenommen')
            ORDER BY offers.created_at DESC
        ''').fetchall()

        nutzer_liste = conn.execute('''
            SELECT id, username, status, faecher, jahrgang FROM users WHERE username != 'admin'
        ''').fetchall()

        conn.close()

            
        return render_template(
            'admin.html',
            neue_anfragen=neue_anfragen,
            bestaetigte_anfragen=bestaetigte_anfragen,
            abgelehnte_anfragen=abgelehnte_anfragen,
            erledigte_anfragen=erledigte_anfragen,
            zugewiesene_anfragen=zugewiesene_anfragen,
            abgelehnte_von_user=abgelehnte_von_user,
            nutzer_liste=nutzer_liste,
            aktive_anfragen=aktive_anfragen
        )
                     
    else:
        return redirect(url_for('login'))

@app.route('/admin/delete_anfrage', methods=['POST'])
def delete_anfrage():
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login'))

    anfrage_id = request.form.get('anfrage_id')
    if anfrage_id:
        conn = get_db_connection()
        conn.execute('DELETE FROM offers WHERE id = ?', (anfrage_id,))
        conn.commit()
        conn.close()
        flash('Anfrage erfolgreich gelöscht.', 'success')

    return redirect(url_for('admin_dashboard'))

@app.route('/admin/delete_all_by_status', methods=['POST'])
def delete_all_by_status():
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login'))

    status = request.form.get('status')
    if status:
        conn = get_db_connection()
        conn.execute('DELETE FROM offers WHERE status = ?', (status,))
        conn.commit()
        conn.close()
        flash(f'Alle Anfragen mit Status "{status}" wurden gelöscht.', 'success')

    return redirect(url_for('admin_dashboard'))
   
@app.route('/admin/update_status', methods=['POST'])
def update_anfrage_status():
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login'))

    anfrage_id = request.form.get('anfrage_id')
    neuer_status = request.form.get('status')

    if anfrage_id and neuer_status in ['offen', 'abgelehnt']:
        conn = get_db_connection()
        conn.execute('UPDATE offers SET status = ? WHERE id = ?', (neuer_status, anfrage_id))
        conn.commit()
        conn.close()
        # Flash-Nachricht je nach Status
        if neuer_status == 'offen':
          flash('Anfrage wurde angenommen.', 'success')
        else:
           flash('Anfrage wurde abgelehnt.', 'warning')

    return redirect(url_for('admin_dashboard'))

@app.route('/admin/zuweisen', methods=['POST'])
def zuweisung_speichern():
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login'))

    anfrage_id = request.form.get('anfrage_id')
    assigned_user_id = request.form.get('assigned_user_id')

    if anfrage_id and assigned_user_id:
        conn = get_db_connection()
        conn.execute('UPDATE offers SET assigned_user_id = ?, status = ? WHERE id = ?', (assigned_user_id, 'zugewiesen', anfrage_id))
        conn.commit()
        conn.close()

    return redirect(url_for('admin_dashboard'))

@app.route('/admin/add_user', methods=['POST'])
def add_user():
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login'))

    username = request.form['username']
    use_default_password = 'use_default_password' in request.form
    password = 'Pa$$w0rd' if use_default_password else request.form['password']

    conn = get_db_connection()
    existing_user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()

    if existing_user:
        conn.close()
        flash("Benutzername bereits vergeben.", "danger")
        return redirect(url_for('benutzerverwaltung'))

    hashed_password = generate_password_hash(password)
    conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
    conn.commit()
    conn.close()

    flash(f"Benutzer {username} erfolgreich hinzugefügt.", "success")
    return redirect(url_for('benutzerverwaltung'))


@app.route('/check_username', methods=['GET'])
def check_username():
    username = request.args.get('username')
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()

    return jsonify({'available': user is None})

@app.route('/anfrage', methods=['GET', 'POST'])
def create_offer():
    if request.method == 'POST':
        fach = request.form['fach']
        name = request.form.get('name', '')
        stunden = request.form.get('stunden', 1)
        klassenstufe = request.form.get('klassenstufe', '')
        geschlecht = request.form.get('geschlecht', '')
        anmerkungen = request.form.get('anmerkungen', '')
        kontakt = request.form.get('kontakt', '')
        wohnort = request.form.get('wohnort', '')

        conn = get_db_connection()
        created_at = datetime.now().strftime('%Y-%m-%d')
        conn.execute('''
            INSERT INTO offers (name, fach, stunden, klassenstufe, geschlecht, anmerkungen, kontakt, wohnort, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'neu', ?)
        ''', (name, fach, stunden, klassenstufe, geschlecht, anmerkungen, kontakt, wohnort, created_at))
        conn.commit()
        conn.close()
        flash("Anfrage erfolgreich gesendet!")
        return redirect(url_for('home'))
    return render_template('anfrage.html')

@app.route('/anfrage_annehmen', methods=['POST'])
def anfrage_annehmen():
    anfrage_id = request.form.get('anfrage_id')
    conn = get_db_connection()
    conn.execute('UPDATE offers SET status = ?, assigned_user_id = ? WHERE id = ?', ('angenommen', session['user_id'], anfrage_id))
    conn.commit()
    conn.close()
    flash('Anfrage erfolgreich angenommen.', 'success')
    return redirect(url_for('anbieter'))


@app.route('/settings', methods=['GET', 'POST'])
def change_password():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        password = request.form['password']
        confirm = request.form['confirmPassword']

        if password != confirm:
            flash('Die Passwörter stimmen nicht überein.', 'danger')
            return render_template('usersettings.html')

        hashed_password = generate_password_hash(password)
        conn = get_db_connection()
        conn.execute('UPDATE users SET password = ? WHERE id = ?', (hashed_password, session['user_id']))
        conn.commit()
        conn.close()

        flash('Dein Passwort wurde erfolgreich geändert!', 'success')
        return redirect(url_for('change_password'))

    return render_template('usersettings.html')

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/anfrage_ablehnen_user', methods=['POST'])
def anfrage_ablehnen_user():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    anfrage_id = request.form.get('anfrage_id')
    kommentar = request.form.get('kommentar', '')

    conn = get_db_connection()
    conn.execute('''
        UPDATE offers
        SET status = ?, user_comment = ?
        WHERE id = ? AND assigned_user_id = ?
    ''', ('abgelehnt_von_user', kommentar, anfrage_id, session['user_id']))
    conn.commit()
    conn.close()
    flash('Anfrage erfolgreich abgelehnt.', 'danger')
    return redirect(url_for('anbieter'))

@app.route('/anfrage_erledigen', methods=['POST'])
def anfrage_erledigen():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    anfrage_id = request.form.get('anfrage_id')

    conn = get_db_connection()
    # Sicherheitsprüfung: nur der richtige Nutzer darf seine Anfrage als erledigt markieren
    anfrage = conn.execute('SELECT * FROM offers WHERE id = ?', (anfrage_id,)).fetchone()

    if anfrage and anfrage['assigned_user_id'] == session['user_id'] and anfrage['status'] == 'angenommen':
        conn.execute('UPDATE offers SET status = ? WHERE id = ?', ('erledigt', anfrage_id))
        conn.commit()

    conn.close()
    return redirect(url_for('anbieter'))

@app.route('/admin/benutzer')
def benutzerverwaltung():
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM users').fetchall()

    user_list = []
    for user in users:
        active_requests = conn.execute('''
            SELECT name AS request_name, fach
            FROM offers
            WHERE assigned_user_id = ? AND status IN ('offen', 'zugewiesen', 'angenommen')
        ''', (user['id'],)).fetchall()

        user_dict = dict(user)
        user_dict['active_requests'] = active_requests
        user_list.append(user_dict)

    conn.close()
    return render_template('benutzerverwaltung.html', users=user_list)




@app.route('/passwort_zuruecksetzen/<int:user_id>', methods=['POST'])
def passwort_zuruecksetzen(user_id):
    neues_passwort = generate_password_hash("Pa$$w0rd")

    conn = get_db_connection()  # nutzt die gleiche helper Funktion
    conn.execute("UPDATE users SET password = ? WHERE id = ?", (neues_passwort, user_id))
    conn.commit()
    conn.close()

    flash("Passwort erfolgreich zurückgesetzt.", "info")
    return redirect(url_for('benutzerverwaltung'))


@app.route('/admin/benutzer/<int:user_id>/loeschen', methods=['POST'])
def benutzer_loeschen(user_id):
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login'))

    # Admin darf sich nicht selbst löschen
    conn = get_db_connection()
    user = conn.execute('SELECT username FROM users WHERE id = ?', (user_id,)).fetchone()

    if user and user['username'] == 'admin':
        flash('Der Admin kann nicht gelöscht werden.', 'warning')
        conn.close()
        return redirect(url_for('benutzerverwaltung'))

    conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()
    flash('Benutzer erfolgreich gelöscht.', 'success')
    return redirect(url_for('benutzerverwaltung'))

@app.route('/usersettings')
def user_settings():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('usersettings.html')

@app.route('/impressum')
def impressum():
    return render_template('impressum.html')

@app.route('/agb')
def agb():
    return render_template('agb.html')

@app.template_filter('datetimeformat')
def datetimeformat(value, format='%d.%m.%Y'):
    try:
        return datetime.fromisoformat(value).strftime(format)
    except Exception:
        return value

@app.route('/update_status', methods=['POST'])
def update_status():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    neuer_status = request.form.get('status')
    conn = get_db_connection()
    conn.execute('UPDATE users SET status = ? WHERE id = ?', (neuer_status, session['user_id']))
    conn.commit()
    conn.close()
    flash('Status gespeichert.', 'success')
    return redirect(url_for('anbieter'))

@app.route('/update_faecher', methods=['POST'])
def update_faecher():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    ausgewaehlte_faecher = request.form.getlist('faecher')
    faecher_str = ",".join(ausgewaehlte_faecher)
    conn = get_db_connection()
    conn.execute('UPDATE users SET faecher = ? WHERE id = ?', (faecher_str, session['user_id']))
    conn.commit()
    conn.close()
    flash('Fächer gespeichert.', 'success')
    return redirect(url_for('anbieter'))


@app.route('/update_jahrgang', methods=['POST'])
def update_jahrgang():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    jahrgang = int(request.form['jahrgang'])  # vom Formular
    user_id = session['user_id']  # aktueller Benutzer aus Session

    conn = get_db_connection()
    conn.execute('UPDATE users SET jahrgang = ? WHERE id = ?', (jahrgang, user_id))
    conn.commit()
    conn.close()

    flash('Jahrgangsstufe gespeichert.', 'success')
    return redirect(url_for('anbieter'))  # oder eine andere gewünschte Seite


@app.route("/zurueckziehen", methods=["POST"])
def zurueckziehen_anfrage():
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for("login"))

    anfrage_id = request.form.get("anfrage_id")

    if not anfrage_id:
        flash("Keine Anfrage-ID angegeben.", "error")
        return redirect(url_for("admin_dashboard"))

    conn = get_db_connection()
    anfrage = conn.execute("SELECT * FROM offers WHERE id = ?", (anfrage_id,)).fetchone()

    if not anfrage:
        flash("Anfrage nicht gefunden.", "error")
        conn.close()
        return redirect(url_for("admin_dashboard"))

    conn.execute("UPDATE offers SET status = 'zurückgezogen' WHERE id = ?", (anfrage_id,))
    conn.commit()
    conn.close()

    flash("Anfrage wurde erfolgreich zurückgezogen.", "success")
    return redirect(url_for("admin_dashboard"))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)