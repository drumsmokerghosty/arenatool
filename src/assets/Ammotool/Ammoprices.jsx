import { useState, useEffect, useRef } from "react";

const ammoTypes = [
    { id: "BS", label: "BS" },
    { id: "M995", label: "M995" },
    { id: "DVC12", label: "DVC12" },
    { id: "7BT1", label: "7BT1" },
];

const Ammoprices = () => {
    // 1. Lazy Initializer for Prices
    const [prices, setPrices] = useState(() => {
        const saved = localStorage.getItem("ammoPrices");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing prices", e);
            }
        }
        return {};
    });

    const [activeAmmo, setActiveAmmo] = useState("BS");

    // 2. Lazy Initializer for Inputs (using the already initialized prices)
    const [inputs, setInputs] = useState(() => {
        const initialData = prices["BS"] || {};
        return {
            low: initialData.low?.[initialData.low.length - 1]?.value ?? "",
            high: initialData.high?.[initialData.high.length - 1]?.value ?? "",
        };
    });

    const [confirmField, setConfirmField] = useState(null);
    const isInitialMount = useRef(true);

    // 3. Persist prices ONLY when they change
    useEffect(() => {
        // Skip the very first render to avoid overwriting storage with empty state
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        localStorage.setItem("ammoPrices", JSON.stringify(prices));
    }, [prices]);

    const handleTabChange = (ammoId) => {
        setActiveAmmo(ammoId);
        setConfirmField(null);

        const ammoData = prices[ammoId] || {};
        setInputs({
            low: ammoData.low?.[ammoData.low.length - 1]?.value ?? "",
            high: ammoData.high?.[ammoData.high.length - 1]?.value ?? "",
        });
    };

    const handleInputChange = (field, value) => {
        setInputs((prev) => ({ ...prev, [field]: value }));
    };

    const confirmSave = (field) => {
        const value = inputs[field];
        if (value === "" || isNaN(value)) {
            setConfirmField(null);
            return;
        }

        const newEntry = { value: Number(value), date: Date.now() };

        setPrices((prev) => ({
            ...prev,
            [activeAmmo]: {
                ...prev[activeAmmo],
                [field]: [...(prev[activeAmmo]?.[field] || []), newEntry],
            },
        }));

        setConfirmField(null);
    };

    return (
        <div className="Profit">
            <div className="tabs" style={{ marginBottom: '15px' }}>
                {ammoTypes.map((ammo) => (
                    <button
                        key={ammo.id}
                        className={activeAmmo === ammo.id ? "active" : ""}
                        onClick={() => handleTabChange(ammo.id)}
                    >
                        {ammo.label}
                    </button>
                ))}
            </div>

            <h3>{activeAmmo} Price Tracker</h3>

            {["low", "high"].map((field) => (
                <div className="input-group" key={field}>
                    <label>{field.toUpperCase()} PRICE</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="number"
                            value={inputs[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            placeholder="Enter price..."
                            style={{ flex: 1 }}
                        />
                        <button
                            className="calc-btn"
                            style={{ marginTop: 0, width: '80px' }}
                            onClick={() => setConfirmField(field)}
                        >
                            Save
                        </button>
                    </div>
                    {confirmField === field && (
                        <div className="confirm-popup">
                            <span>Confirm {field}?</span>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => confirmSave(field)}>Yes</button>
                                <button onClick={() => setConfirmField(null)}>No</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Ammoprices;