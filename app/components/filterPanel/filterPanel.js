import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const FilterComponent = ({ setFilteredData }) => {
  const [repairNumber, setRepairNumber] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [reporting, setReporting] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [brand, setBrand] = useState("");
  const [rezolution, setRezolution] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://node-kwitka.onrender.com/api/warranty/filter",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            repairNumber,
            certificateNumber,
            reporting,
            startDate,
            endDate,
            brand,
            rezolution,
          }),
        }
      );
      const data = await response.json();
      console.log("Отримані дані:", data);
      setFilteredData(data);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setRepairNumber("");
    setCertificateNumber("");
    setReporting("");
    setStartDate("");
    setEndDate("");
    setBrand("");
    setRezolution("");
    fetchData();
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.filterGroup}>
        <input
          type="text"
          value={repairNumber}
          onChange={(e) => setRepairNumber(e.target.value)}
          placeholder="Номер ремонту"
        />
      </div>

      <div className={styles.filterGroup}>
        <input
          type="text"
          value={certificateNumber}
          onChange={(e) => setCertificateNumber(e.target.value)}
          placeholder="Номер талону"
        />
      </div>

      <div className={styles.filterGroup}>
        <input
          type="text"
          value={reporting}
          onChange={(e) => setReporting(e.target.value)}
          placeholder="Клієнт"
        />
      </div>

      <div className={styles.filterGroup}>
        <label>Діапазон дат:</label>
        <input
          className={styles.dateInput}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          className={styles.dateInput}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className={styles.filterGroup}>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Бренд</option>
          <option value="Metabo">Metabo</option>
          <option value="Oleo-mac">Oleo-Mac</option>
          <option value="Makita">Makita</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <select
          value={rezolution}
          onChange={(e) => setRezolution(e.target.value)}
        >
          <option value="">Статус</option>
          <option value="ok">Погоджено</option>
          <option value="rejected">Відхилено</option>
          <option value="pending">На погодженні</option>
        </select>
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={styles.applyBtn}
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? <div className={styles.loader}></div> : "Застосувати"}
        </button>
        <button
          className={styles.clearBtn}
          onClick={resetFilters}
          disabled={loading}
        >
          Скинути
        </button>
      </div>
    </div>
  );
};

export default FilterComponent;
