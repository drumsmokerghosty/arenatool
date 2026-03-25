import { useState } from "react";

const Profit = () => {
    const [activeTab, setActiveTab] = useState("perBullet");
    const [buyPrice, setBuyPrice] = useState("");
    const [sellPrice, setSellPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [profit, setProfit] = useState(null);

    const calculateProfit = () => {
        const buy = parseFloat(buyPrice);
        const sell = parseFloat(sellPrice);
        const qty = parseFloat(quantity);

        if (isNaN(buy) || isNaN(sell)) {
            setProfit("Enter valid numbers");
            return;
        }

        const fee = sell * 0.098;
        const profitPerBullet = sell - fee - buy;

        if (activeTab === "perBullet") {
            setProfit(profitPerBullet.toFixed(2));
        } else {
            if (isNaN(qty)) {
                setProfit("Enter a valid quantity");
                return;
            }
            setProfit((profitPerBullet * qty).toFixed(2));
        }
    };

    return (
        <div className="Profit">
            <div className="tabs" style={{ marginBottom: '15px' }}>
                <button className={activeTab === "perBullet" ? "active" : ""} onClick={() => setActiveTab("perBullet")}>Single</button>
                <button className={activeTab === "total" ? "active" : ""} onClick={() => setActiveTab("total")}>Bulk</button>
            </div>

            <div className="input-group">
                <label>BUY PRICE</label>
                <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder="0" />
            </div>

            <div className="input-group">
                <label>SELL PRICE (9.8% FEE INCL.)</label>
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="0" />
            </div>

            {activeTab === "total" && (
                <div className="input-group">
                    <label>QUANTITY</label>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="100" />
                </div>
            )}

            <button className="calc-btn" onClick={calculateProfit}>Calculate</button>

            {profit !== null && (
                <div className="result">
                    {activeTab === "perBullet" ? `Profit: ${profit} / bullet` : `Total: ${profit}`}
                </div>
            )}
        </div>
    );
};

export default Profit;