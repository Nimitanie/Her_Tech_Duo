# Her_Tech_Duo

## RealityRPG: Level Up Your Real Life ⚔️

**RealityRPG** is a gamified task management web application designed to turn your daily chores and goals into an immersive RPG adventure. Built with **Flask** and **JavaScript**, it transforms productivity into a journey of leveling up, earning rewards, and managing your "Stress Levels" through a beautifully themed medieval fantasy interface.

---

## 📸 Project Gallery

### 1. The Gateway (`index.html`)

The journey begins here. A cinematic entrance with sequential animations that sets the tone for your adventure.

### 2. The Quest Forge (`input.html`)

Log your missions on an ancient scroll. Set your priorities and deadlines to prepare for the challenges ahead.

### 3. Hero Dashboard (`dashboard.html`)

Track your progress in real-time. View your current Level, XP (displayed as diamonds), and Stress Levels. Watch as your character grows with every completed quest.

### 4. Level Up Celebration

Reach new heights and get recognized by the legendary mentor. A dynamic pop-up appears every time you cross a major XP threshold.

### 5. Future Simulation (`simulation.html`)

Use the Oracle’s power to project your path. Analyze your 7-day performance trend, burnout risk, and predicted XP growth through interactive charts.

---

## 🚀 Core Features

* **Immersive RPG UI:** A consistent medieval fantasy theme featuring scrolls, castles, and heroic avatars.
* **Dynamic Leveling System:**
* **Level 0 to 1:** 100 XP
* **Level 1 to 2:** 500 XP
* **Level 2+:** Increments every 1000 XP


* **Risk & Reward Logic:**
* **+10 XP** for every completed quest.
* **-20 XP** penalty for missing a deadline.


* **Stress Management:** A dynamic stress bar that fluctuates based on your number of pending "Active Missions."
* **Predictive Analytics:** Interactive line charts using **Chart.js** to visualize your productivity trends.
* **Persistent Data:** Uses `localStorage` to ensure your hero's progress is saved directly in your browser.

---

## 🛠️ Technology Stack

* **Backend:** Python (Flask)
* **Frontend:** HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6)
* **Data Visualization:** Chart.js
* **Fonts:** Google Fonts (Cinzel & Playfair Display)

---

## ⚙️ Setup & Installation

1. **Clone the Repository:**
```bash
git clone https://github.com/yourusername/RealityRPG.git
cd RealityRPG

```


2. **Install Dependencies:**
Ensure you have Python installed, then run:
```bash
pip install flask

```


3. **Directory Structure:**
Ensure your folders are organized as follows:
```text
/RealityRPG
├── app.py
├── templates/
│   ├── index.html
│   ├── input.html
│   ├── dashboard.html
│   └── simulation.html
└── static/
    ├── style.css
    └── images/
        ├── main-bg.jpeg
        ├── scroll.png
        ├── hero.png
        └── boss.png

```


4. **Run the Application:**
```bash
python app.py

```


Open `http://127.0.0.1:5000` in your browser.

---

## 📽️ Video Demonstration

media/Reality_RPG.mp4

---

**Would you like me to help you write the "Contributing" or "License" section to make this look like a professional open-source repository?**
