import os
import sqlite3
from flask import Flask, render_template, request, jsonify, session, redirect, url_for

app = Flask(__name__)
app.secret_key = "super_secret_team_tracker_key"
DATABASE = "database.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Auto-creates the database file, tables, and populates mock data instantly."""
    if not os.path.exists(DATABASE):
        open(DATABASE, 'w').close()

    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'Admin'
        )
    ''')

    # 2. Team Members Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS team_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            available INTEGER DEFAULT 1,
            last_updated TEXT NOT NULL
        )
    ''')

    # Seed default user if absent
    cursor.execute("SELECT * FROM users WHERE email = 'admin@example.com'")
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (name, email, password, role)
            VALUES ('Admin User', 'admin@example.com', 'password123', 'Admin')
        ''')

    # Seed initial members matching the exact mockup images
    cursor.execute("SELECT COUNT(*) FROM team_members")
    if cursor.fetchone()[0] == 0:
        seed_members = [
            ('Alex Rivera', 'Senior Developer', 1, '2 mins ago'),
            ('Samantha Chen', 'UI Designer', 0, '1 min ago'),
            ('Jordan Taylor', 'Project Manager', 1, 'Just now'),
            ('Maria Garcia', 'Marketing Lead', 0, '5 mins ago')
        ]
        cursor.executemany('''
            INSERT INTO team_members (name, role, available, last_updated)
            VALUES (?, ?, ?, ?)
        ''', seed_members)

    conn.commit()
    conn.close()

# ----------------- ROUTING CONTROLLERS -----------------

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard_page'))
    return render_template('login.html')

@app.route('/dashboard')
def dashboard_page():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    return render_template('dashboard.html', user_name=session.get('user_name'))

# ----------------- AUTHENTICATION API -----------------

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password)).fetchone()
    conn.close()

    if user:
        session['user_id'] = user['id']
        session['user_name'] = user['name']
        return jsonify({"success": True})

    return jsonify({"success": False, "message": "Invalid credentials provided."}), 401

@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({"success": True})

# ----------------- CRUD TEAM MEMBERS API -----------------

@app.route('/api/team', methods=['GET'])
def get_team():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized access attempt"}), 401
    conn = get_db_connection()
    members = conn.execute('SELECT * FROM team_members').fetchall()
    conn.close()
    return jsonify([{"id": m['id'], "name": m['name'], "role": m['role'], "available": bool(m['available']), "lastUpdated": m['last_updated']} for m in members])

@app.route('/api/team', methods=['POST'])
def add_member():
    if 'user_id' not in session: return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO team_members (name, role, available, last_updated) VALUES (?, ?, 1, 'Just now')", (data.get('name'), data.get('role')))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route('/api/team/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    if 'user_id' not in session: return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json()
    conn = get_db_connection()
    conn.execute("UPDATE team_members SET name = ?, role = ?, last_updated = 'Just now' WHERE id = ?", (data.get('name'), data.get('role'), member_id))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route('/api/team/status/<int:member_id>', methods=['PATCH'])
def toggle_status(member_id):
    if 'user_id' not in session: return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json()
    conn = get_db_connection()
    conn.execute("UPDATE team_members SET available = ?, last_updated = 'Just now' WHERE id = ?", (1 if data.get('available') else 0, member_id))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route('/api/team/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    if 'user_id' not in session: return jsonify({"error": "Unauthorized"}), 401
    conn = get_db_connection()
    conn.execute('DELETE FROM team_members WHERE id = ?', (member_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)