# 🎯 Ammo Tool | Market Tracker & Profit Calculator

A high-performance React dashboard designed for tracking market prices, calculating flip profits, and monitoring "drop" windows for high-tier items. This tool uses local persistence to keep your data safe without needing a backend.

---

## 🌐 Live Demo
**Check out the live tool here:** [https://drumsmokerghosty.github.io/arenatool/](https://drumsmokerghosty.github.io/arenatool/)

---

## 🚀 Key Features

### 📈 Live Price Tracker
- **Multi-Ammo Support**: Log "Low" and "High" market prices for BS, M995, DVC12, and 7BT1.
- **Data Integrity**: Built-in confirmation system to prevent accidental price overrides.
- **Persistence**: Automatically saves all price history to `localStorage`.

### 📊 Market Visualizer
- **Real-Time Charts**: Powered by **Chart.js**, displaying the last 10 price entries to identify market trends at a glance.
- **Status Indicator**: Real-time UTC clock integration showing if the market is currently **OPEN** or **CLOSED** (08:00 - 21:00 UTC).
- **Drop Timer**: User-synced countdown timer to predict the next 20-minute stock refresh window.

### 💰 Profit Calculator
- **Smart Logic**: Automatically accounts for a **9.8% market fee** on all sales.
- **Two Modes**:
    - **Single**: Calculate net profit per individual bullet.
    - **Bulk**: Calculate total ROI based on custom stack quantities.

### ⚙️ Data Management
- **JSON Backup**: Export your entire price history to a `.json` file.
- **Instant Restore**: Import previous backups to sync data across different browsers.
- **Wipe Utility**: One-click "Danger Zone" button to reset all local tracking data.

---

## 🛠️ Tech Stack

* **Frontend**: React.js
* **Charts**: Chart.js & `react-chartjs-2`
* **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`, `useRef`)
* **Storage**: Browser LocalStorage API
* **Styling**: Modern CSS3 (Variables & Flexbox)

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/drumsmokerghosty/arenatool.git](https://github.com/drumsmokerghosty/arenatool.git)
   cd arenatool