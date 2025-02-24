import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const FilterComponent = ({ data, setFilteredData }) => {
  const [repairNumber, setRepairNumber] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [reporting, setReporting] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [brand, setBrand] = useState("");
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://node-kwitka.onrender.com/api/warranty/filter",
        {
          method: "POST", // Вказуємо метод POST
          headers: {
            "Content-Type": "application/json", // Вказуємо тип контенту
          },
          body: JSON.stringify({
            repairNumber,
            certificateNumber,
            reporting,
            startDate,
            endDate,
            brand,
            resolution,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      setFilteredData(data);
    };

    fetchData();
  }, [
    repairNumber,
    certificateNumber,
    reporting,
    startDate,
    endDate,
    brand,
    resolution,
    setFilteredData,
  ]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.filterGroup}>
        <label></label>
        <input
          type="text"
          value={repairNumber}
          onChange={(e) => setRepairNumber(e.target.value)}
          placeholder="Номер ремонту"
        />
      </div>

      <div className={styles.filterGroup}>
        <label></label>
        <input
          type="text"
          value={certificateNumber}
          onChange={(e) => setCertificateNumber(e.target.value)}
          placeholder="Номер талону"
        />
      </div>

      <div className={styles.filterGroup}>
        <label></label>
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
        <label></label>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Бренд</option>
          <option value="Metabo">Metabo</option>
          <option value="Oleo-mac">Oleo-Mac</option>
          <option value="Sony">Sony</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label></label>
        <select
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
        >
          <option value="">Статус</option>
          <option value="ok">Погоджено</option>
          <option value="rejected">Відхилено</option>
          <option value="">На погоденні</option>
        </select>
      </div>
    </div>
  );
};

export default FilterComponent;
