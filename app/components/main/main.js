"use client";

import React, { useEffect, useState } from "react";
import styles from "./main.module.css";
import axios from "axios";
import UploadCertificate from "../form/addCertificateForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Header = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useState({
    repairNumber: "",
    certificateNumber: "",
    brand: "",
    saleDate: null,
  });

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get("/api/warranty");
        setCertificates(response.data);
        setFilteredCertificates(response.data);
        setLoading(false);
      } catch (err) {
        setError("Не вдалося завантажити сертифікати.");
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Фільтрація сертифікатів
  useEffect(() => {
    let filtered = certificates;

    // Фільтрація за номером ремонту
    if (searchParams.repairNumber) {
      filtered = filtered.filter((cert) =>
        cert.repairNumber
          .toLowerCase()
          .includes(searchParams.repairNumber.toLowerCase())
      );
    }

    // Фільтрація за номером сертифікату
    if (searchParams.certificateNumber) {
      filtered = filtered.filter((cert) =>
        cert.certificateNumber
          .toLowerCase()
          .includes(searchParams.certificateNumber.toLowerCase())
      );
    }

    // Фільтрація за брендом
    if (searchParams.brand) {
      filtered = filtered.filter((cert) =>
        cert.brand.toLowerCase().includes(searchParams.brand.toLowerCase())
      );
    }

    // Фільтрація за датою продажу
    if (searchParams.saleDate) {
      filtered = filtered.filter(
        (cert) => cert.saleDate && cert.saleDate.includes(searchParams.saleDate)
      );
    }

    setFilteredCertificates(filtered);
  }, [searchParams, certificates]);

  const handleFormSubmit = async (newCertificate) => {
    try {
      const response = await axios.post("/api/warranty", newCertificate);
      setCertificates((prevCertificates) => [
        ...prevCertificates,
        response.data,
      ]);
      setShowForm(false); // Сховати форму після додавання сертифікату
    } catch (err) {
      setError("Не вдалося додати сертифікат.");
    }
  };

  const handleAddCertificate = () => {
    setShowForm(true); // Показати форму при натисканні кнопки
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const redirectToPDF = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <main className={styles.container}>
      <div className={styles.head}>
        <h1>Звіт по гарантійних ремонтах </h1>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setShowForm(false)}>
              &times;
            </span>
            <UploadCertificate onSubmit={handleFormSubmit} />
          </div>
        </div>
      )}

      <div>
        <div className={styles.searchForm}>
          <div>
            <button className={styles.newBtn} onClick={handleAddCertificate}>
              Додати новий
            </button>
          </div>
          <div className={styles.searchBlock}>
            <input
              className={styles.filterInput}
              type="text"
              name="repairNumber"
              placeholder="Номер ремонту"
              value={searchParams.repairNumber}
              onChange={handleSearchChange}
            />
            <input
              className={styles.filterInput}
              type="text"
              name="certificateNumber"
              placeholder="Номер сертифікату"
              value={searchParams.certificateNumber}
              onChange={handleSearchChange}
            />
            <select
              className={styles.filterInput}
              name="brand"
              value={searchParams.brand}
              onChange={handleSearchChange}
            >
              <option value="">Виберіть бренд</option>
              <option value="Bosch">Bosch</option>
              <option value="Makita">Makita</option>
              <option value="Metabo">Metabo</option>
              <option value="Oleo-Mac">Oleo-Mac</option>
            </select>

            <input
              className={styles.filterInput}
              type="date"
              name="saleDate"
              value={searchParams.saleDate || ""}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {loading && <p>Завантаження гарантійних ремонтів...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <ul>
            {filteredCertificates.length > 0 ? (
              <table className={styles.certificateTable}>
                <thead>
                  <tr className={styles.tableTitle}>
                    <th>Номер ремонту</th>
                    <th>Дата заповнення</th>
                    <th>Гарантійний талон</th>
                    <th>Дата продажу</th>
                    <th>Менеджер</th>
                    <th>Бренд</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id}>
                      <td>{cert.repairNumber}</td>
                      <td>{formatDate(cert.createdAt)}</td>
                      <td>{cert.certificateNumber}</td>
                      <td>{formatDate(cert.saleDate)}</td>
                      <td>{cert.manager}</td>
                      <td>{cert.brand}</td>
                      <td>
                        <span
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={() => redirectToPDF(cert.imageUrl)}
                        >
                          Завантажити PDF
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Немає сертифікатів за вашими критеріями.</p>
            )}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Header;
