import { useState } from "react";
import "./Ammotool.css";
import Profit from "./Profit.jsx";
import Ammoprices from "./Ammoprices.jsx";
import Market from "./Market.jsx";

const Ammotool = () => {
    const [activeTab, setActiveTab] = useState("profit");

    const tabs = [
        { id: "profit", label: "Profit Calc" },
        { id: "prices", label: "Price Tracker" },
        { id: "market", label: "Live Market" },
        { id: "settings", label: "Settings" },
    ];

    const handleExport = () => {
        const data = JSON.stringify(localStorage);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ammotool_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                localStorage.clear();
                Object.keys(data).forEach((key) => {
                    localStorage.setItem(key, data[key]);
                });
                alert("Data imported successfully! Reloading...");
                window.location.reload();
            } catch (err) {
                alert("Failed to import: Invalid file format.");
            }
        };
        reader.readAsText(file);
    };

    const renderContent = () => {
        switch (activeTab) {
            case "profit": return <Profit />;
            case "prices": return <Ammoprices />;
            case "market": return <Market />;
            case "settings":
                return (
                    <div className="settings-container">
                        <div className="settings-section">
                            <h3>System Data</h3>
                            <p className="settings-description">
                                Export your data to a JSON file for backup, or import a previous session.
                            </p>
                            <div className="settings-actions">
                                <button className="settings-btn" onClick={handleExport}>
                                    Export Backup (.json)
                                </button>

                                <label className="settings-btn secondary">
                                    Import Data File
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImport}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        </div>

                        <hr className="settings-divider" />

                        <div className="settings-section danger-zone">
                            <label className="danger-label">Danger Zone</label>
                            <button
                                className="settings-btn danger"
                                onClick={() => {
                                    if(window.confirm("Warning: This will permanently delete all local data. Continue?")) {
                                        localStorage.clear();
                                        window.location.reload();
                                    }
                                }}
                            >
                                Reset All Local Data
                            </button>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="Ammotool">
            <div className="header">
                <h2>Ammo tool</h2>
            </div>
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={activeTab === tab.id ? "active" : ""}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Ammotool;