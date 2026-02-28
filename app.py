from flask import Flask, render_template, request, redirect
import sqlite3
from datetime import datetime

app = Flask(__name__)

# ===============================
# DATABASE SETUP
# ===============================

def init_db():

    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    # Tasks table
    c.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_name TEXT,
        priority TEXT,
        deadline TEXT,
        energy INTEGER,
        mood TEXT,
        completed INTEGER DEFAULT 0
    )
    """)

    # Player stats table
    c.execute("""
    CREATE TABLE IF NOT EXISTS player_stats (
        id INTEGER PRIMARY KEY,
        total_xp INTEGER DEFAULT 0,
        total_stress INTEGER DEFAULT 0
    )
    """)

    # Default player row
    c.execute("""
    INSERT OR IGNORE INTO player_stats (id, total_xp, total_stress)
    VALUES (1, 0, 0)
    """)

    conn.commit()
    conn.close()

init_db()

# ===============================
# HOME PAGE
# ===============================

@app.route("/")
def home():
    return render_template("index.html")

# ===============================
# INPUT PAGE
# ===============================

@app.route("/input", methods=["GET", "POST"])
def input_page():

    if request.method == "POST":

        task_name = request.form["task_name"]
        priority = request.form["priority"]
        deadline = request.form["deadline"]
        energy = int(request.form["energy"])
        mood = request.form["mood"]

        conn = sqlite3.connect("database.db")
        c = conn.cursor()

        c.execute("""
        INSERT INTO tasks (task_name, priority, deadline, energy, mood)
        VALUES (?, ?, ?, ?, ?)
        """, (task_name, priority, deadline, energy, mood))

        conn.commit()
        conn.close()

        return redirect("/dashboard")

    return render_template("input.html")

# ===============================
# DASHBOARD
# ===============================

@app.route("/dashboard")
def dashboard():

    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    # Get stats
    c.execute("SELECT total_xp, total_stress FROM player_stats WHERE id=1")
    data = c.fetchone()

    total_xp = data[0] if data else 0
    total_stress = data[1] if data else 0

    # Get active tasks
    c.execute("SELECT * FROM tasks WHERE completed=0")
    tasks = c.fetchall()

    conn.close()

    # ===============================
    # LEVEL SYSTEM
    # ===============================

    if total_xp < 200:
        level = 1
        max_xp = 200

    elif total_xp < 500:
        level = 2
        max_xp = 500

    elif total_xp < 1000:
        level = 3
        max_xp = 1000

    else:
        level = 4
        max_xp = 2000

    xp_progress = int((total_xp / max_xp) * 100)

    # ===============================
    # STRESS %
    # ===============================

    stress_progress = min(total_stress, 100)

    # ===============================
    # WARNINGS
    # ===============================

    burnout_warning = False
    rest_suggestion = False

    if total_stress > 70:
        burnout_warning = True

    if total_stress > 50:
        rest_suggestion = True

    # ===============================
    # PASS TO HTML
    # ===============================

    return render_template("dashboard.html",

        xp=total_xp,
        stress=total_stress,
        level=level,
        tasks=tasks,

        xp_progress=xp_progress,
        stress_progress=stress_progress,

        burnout_warning=burnout_warning,
        rest_suggestion=rest_suggestion
    )

# ===============================
# COMPLETE TASK
# ===============================

@app.route("/complete/<int:task_id>")
def complete_task(task_id):

    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    # Get task info
    c.execute("SELECT priority, energy, mood, deadline FROM tasks WHERE id=?", (task_id,))
    task = c.fetchone()

    priority, energy, mood, deadline = task

    # XP formula
    priority_weight = {"High":10, "Medium":5, "Low":2}
    mood_bonus = {"Happy":20, "Neutral":10, "Stressed":0}

    xp = (priority_weight[priority] * 10) + (energy * 2) + mood_bonus[mood]

    # Stress formula
    stress = 0

    if energy < 4:
        stress += 10

    # deadline penalty
    if deadline:

        today = datetime.today().date()
        task_deadline = datetime.strptime(deadline,"%Y-%m-%d").date()

        if today > task_deadline:
            stress += 15

    # Update stats
    c.execute("""
    UPDATE player_stats
    SET total_xp = total_xp + ?,
        total_stress = total_stress + ?
    WHERE id=1
    """,(xp, stress))

    # Mark completed
    c.execute("UPDATE tasks SET completed=1 WHERE id=?", (task_id,))

    conn.commit()
    conn.close()

    return redirect("/dashboard")

# ===============================
# ===============================
# SIMULATION PAGE
# ===============================

@app.route("/simulation")
def simulation():
    return render_template("simulation.html")

if __name__ == "__main__":
    app.run(debug=True)