import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { debounce } from "lodash"; // Імпортуємо lodash для debounce

const FilterComponent = ({
  setFilteredData,
  data,
  showModal,
  setShowModal,
}) => {
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

      setFilteredData(data);
      if (data.length < 1) {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = debounce(fetchData, 1000);

  useEffect(() => {
    debouncedFetchData();

    return () => {
      debouncedFetchData.cancel();
    };
  }, [
    repairNumber,
    certificateNumber,
    reporting,
    startDate,
    endDate,
    brand,
    rezolution,
  ]);

  const resetFilters = () => {
    setRepairNumber("");
    setCertificateNumber("");
    setReporting("");
    setStartDate("");
    setEndDate("");
    setBrand("");
    setRezolution("");
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.filterGroup}>
        <input
          type="text"
          value={repairNumber}
          onChange={(e) => setRepairNumber(e.target.value)}
          placeholder="Номер ремонту"
          disabled={showModal}
        />
      </div>

      <div className={styles.filterGroup}>
        <input
          type="text"
          value={certificateNumber}
          onChange={(e) => setCertificateNumber(e.target.value)}
          placeholder="Номер талону"
          disabled={showModal}
        />
      </div>

      <div className={styles.filterGroup}>
        <input
          type="text"
          value={reporting}
          onChange={(e) => setReporting(e.target.value)}
          placeholder="Клієнт"
          disabled={showModal}
        />
      </div>

      <div className={styles.filterGroup}>
        <label>Діапазон дат:</label>
        <input
          className={styles.dateInput}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={showModal}
        />
        <input
          className={styles.dateInput}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={showModal}
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
    </div>
  );
};

export default FilterComponent;
