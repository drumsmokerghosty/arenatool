import { useEffect, useState, useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const OPEN_HOUR = 8;
const CLOSE_HOUR = 21;

const Market = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("BS");
    const [timer, setTimer] = useState("");
    const [storedPrices, setStoredPrices] = useState({});
    const [ammoData, setAmmoData] = useState({
        BS: { lastDrop: 51, avgLow: 6000, avgHigh: 7500 },
        M995: { lastDrop: 12, avgLow: 5500, avgHigh: 7600 },
        DVC12: { lastDrop: 33, avgLow: 5760, avgHigh: 7999 },
        "7BT1": { lastDrop: 5, avgLow: 8400, avgHigh: 11500 },
    });

    // 1. Load data from LocalStorage (Sync with Price Tracker)
    useEffect(() => {
        const updatePrices = () => {
            const saved = localStorage.getItem("ammoPrices");
            if (saved) setStoredPrices(JSON.parse(saved));
        };
        updatePrices();
        window.addEventListener("storage", updatePrices); // Listen for changes in other tabs
        return () => window.removeEventListener("storage", updatePrices);
    }, []);

    // 2. Market Status & Timer Logic
    const checkMarketStatus = () => {
        const hour = new Date().getUTCHours();
        return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
    };

    useEffect(() => {
        const updateStatus = () => setIsOpen(checkMarketStatus());
        updateStatus();
        const interval = setInterval(updateStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const updateTimer = () => {
            const lastDropMinute = ammoData[activeTab].lastDrop;
            const now = new Date();
            let dropTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), lastDropMinute, 0));
            dropTime.setUTCMinutes(dropTime.getUTCMinutes() + 20);
            if (dropTime < now) dropTime.setUTCDate(dropTime.getUTCDate() + 1);

            const diff = dropTime - now;
            if (diff <= 0) setTimer("Drop happening!");
            else {
                const m = Math.floor(diff / 1000 / 60);
                const s = Math.floor((diff / 1000) % 60);
                setTimer(`${m}m ${s}s`);
            }
        };
        const timerInterval = setInterval(updateTimer, 1000);
        return () => clearInterval(timerInterval);
    }, [activeTab, ammoData]);

    // 3. Chart Data Preparation
    const chartData = useMemo(() => {
        const history = storedPrices[activeTab] || { low: [], high: [] };

        // Get last 10 entries for cleaner viewing
        const lowData = (history.low || []).slice(-10);
        const highData = (history.high || []).slice(-10);

        // Create labels from timestamps
        const labels = lowData.map(entry =>
            new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );

        return {
            labels,
            datasets: [
                {
                    label: "Low Price",
                    data: lowData.map(e => e.value),
                    borderColor: "#22c55e",
                    backgroundColor: "rgba(34, 197, 94, 0.2)",
                    tension: 0.3,
                    pointRadius: 4,
                },
                {
                    label: "High Price",
                    data: highData.map(e => e.value),
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    tension: 0.3,
                    pointRadius: 4,
                }
            ],
        };
    }, [storedPrices, activeTab]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: "#94a3b8", size: 10 } },
            y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8", size: 10 } }
        }
    };

    return (
        <div className="Market">
            <div className="marketheader">
                <div className={`market-indicator ${isOpen ? "open" : "closed"}`} />
                <div className="market-content">
                    <strong>Market is {isOpen ? "OPEN" : "CLOSED"}</strong>
                    <div className="market-subtext">{isOpen ? "Drops imminent" : "9:00 - 21:00 UTC"}</div>
                </div>
            </div>

            <div className="tabs" style={{ marginBottom: "12px" }}>
                {Object.keys(ammoData).map((type) => (
                    <button key={type} className={activeTab === type ? "active" : ""} onClick={() => setActiveTab(type)}>
                        {type}
                    </button>
                ))}
            </div>

            {/* Chart Section */}
            <div style={{ height: "140px", marginBottom: "15px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "10px" }}>
                <Line data={chartData} options={chartOptions} />
            </div>

            <div className="tab-content" style={{ padding: 0 }}>
                <div style={{ background: "var(--bg-input)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                        <span style={{ color: "var(--text-muted)" }}>NEXT DROP WINDOW</span>
                        <span style={{ color: "var(--accent)", fontWeight: "bold" }}>{timer}</span>
                    </div>
                </div>
            </div>

            <button className="calc-btn" onClick={() => {
                const now = new Date();
                setAmmoData({...ammoData, [activeTab]: { ...ammoData[activeTab], lastDrop: now.getUTCMinutes() }});
            }}>
                Log Ammo Drop
            </button>
        </div>
    );
};

export default Market;