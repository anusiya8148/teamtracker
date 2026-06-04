# Team Availability Tracker 👥

A fully functional, real-world full-stack web application designed to track, manage, and coordinate team members' availability status in real time. Built using **Flask (Python)** for the backend, an auto-initializing **SQLite3** database, and a modern, responsive single-page architecture (SPA) frontend with a beautiful SaaS purple gradient theme.

---

## 🚀 Key Features

* **Secure Authentication:** Login system pre-configured with an admin dashboard account, featuring custom secure session cookies.
* **Modern SaaS Layout:** High-fidelity user interface matching premium glassmorphism layouts, smooth shadows, and polished typography.
* **Dynamic View Switcher (SPA):** Seamlessly alternate between sections via the sidebar without refreshing the page:
    * 📊 **Dashboard Overview:** Displays live counter metrics cards and the interactive management grid tracker.
    * 👥 **Team Members:** Specialized full roster log summary index grid.
    * 📈 **Reports:** Renders live calculated analytical chart visual widgets (Pie chart & Bar graph distributions).
    * ⚙️ **Settings:** Standard application status and deployment parameter flags.
* **Complete CRUD Operations:** Add new members, modify names/business roles via custom overlays, remove profiles, and execute real-time state switches.
* **Instant UI Updates:** Toggling an availability switch patches the local SQLite state asynchronously, calculates counters instantly, and shows a custom toast pop-up notification.
* **Smart Search:** Real-time filtering across name and role parameters.
* **Automated Data Management:** Automated SQLite engine file creation and immediate placeholder table population upon initial script boot.

---

## 🛠️ Architecture & Tech Stack

* **Backend:** Python 3, Flask framework
* **Database:** SQLite3 (Embedded SQL engine)
* **Frontend:** HTML5, CSS3 Custom Properties (Variables), Vanilla JavaScript (Asynchronous Fetch API Router Model)

---

## 📂 Project Directory Layout

Ensure your system workspace structures mirror the file tree organization map exactly as shown below:

```text
team_tracker/
│
├── app.py                  # Core Main Backend Controller (API Router Engine)
├── database.db             # SQLite Production Data Store (Auto-generated on boot)
│
├── static/
│   ├── css/
│   │   └── style.css       # Complete Custom SaaS Layout Stylesheet File
│   └── js/
│       └── app.js          # SPA Engine, Async Fetch API Requests, Data Components
│
└── templates/
    ├── login.html          # Authentication Template UI Screen
    └── dashboard.html      # Consolidated Workstations Shell Page (All 4 Sidebar Tabs)

    💻 Installation & Step-by-Step Launch
Follow these steps to run the application on your computer:

1. Extract or Navigate to the Workspace Directory
Open your preferred system terminal command shell console window inside the directory where your project files are stored:

Bash
cd team_tracker
2. Install Dependencies
This application runs natively with basic Flask. Install it using Python's package manager:

Bash
pip install flask
3. Initialize the Application
Execute the Python file. This command will auto-create the database file (database.db), initialize structural system storage tables, and inject default sample profiles instantly:

Bash
python app.py
4. Open in Your Web Browser
Once your server status prints active running configurations logs in the console pipeline, open your favorite web browser utility and load the local link:

Plaintext
[http://127.0.0.1:5000/](http://127.0.0.1:5000/)
🔒 Default Access Credentials
Use these pre-loaded authentication details to log past the security portal immediately:

Default System Email: admin@example.com

Secure Access Password: password123

Author
# Anusiya R
Full stack developer
