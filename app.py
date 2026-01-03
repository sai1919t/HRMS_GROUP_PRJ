from flask import Flask, render_template, request, redirect, url_for
import psycopg2

# Create Flask application
app = Flask(__name__)

# PostgreSQL database connection
conn = psycopg2.connect(
    database="performance_dbb",
    user="postgres",
    password="Vams@123",
    host="127.0.0.1",
    port="5432"
)

# -----------------------------------
# HOME PAGE – Employee Cards
# -----------------------------------
@app.route("/")
def home():
    cur = conn.cursor()
    cur.execute("SELECT * FROM employee")
    employees = cur.fetchall()
    return render_template("index.html", employees=employees)

# -----------------------------------
# PROFILE PAGE – View Performance
# -----------------------------------
@app.route("/profile/<int:emp_id>")
def profile(emp_id):
    cur = conn.cursor()

    # Employee basic details
    cur.execute("SELECT * FROM employee WHERE emp_id=%s", (emp_id,))
    emp = cur.fetchone()

    # KRA
    cur.execute("SELECT * FROM kra WHERE emp_id=%s", (emp_id,))
    kras = cur.fetchall()

    # KPI
    cur.execute("SELECT * FROM kpi WHERE emp_id=%s", (emp_id,))
    kpis = cur.fetchall()

    # Appraisal (ONLY ONE – Annual)
    cur.execute("SELECT * FROM appraisal WHERE emp_id=%s", (emp_id,))
    appraisal = cur.fetchone()

    # Goals
    cur.execute("SELECT * FROM goals WHERE emp_id=%s", (emp_id,))
    goals = cur.fetchall()

    # 360° Feedback
    cur.execute("SELECT * FROM feedback WHERE emp_id=%s", (emp_id,))
    feedbacks = cur.fetchall()

    return render_template(
        "profile.html",
        emp=emp,
        kras=kras,
        kpis=kpis,
        appraisal=appraisal,
        goals=goals,
        feedbacks=feedbacks
    )

# -----------------------------------
# RUN APPLICATION
# -----------------------------------
if __name__ == "__main__":
    app.run(debug=True)