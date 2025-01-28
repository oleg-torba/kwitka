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
    manager: "", // Додано нове поле для фільтру
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

  useEffect(() => {
    let filtered = certificates;

    if (searchParams.repairNumber) {
      filtered = filtered.filter((cert) =>
        cert.repairNumber
          .toLowerCase()
          .includes(searchParams.repairNumber.toLowerCase())
      );
    }

    if (searchParams.certificateNumber) {
      filtered = filtered.filter((cert) =>
        cert.certificateNumber
          .toLowerCase()
          .includes(searchParams.certificateNumber.toLowerCase())
      );
    }

    if (searchParams.brand) {
      filtered = filtered.filter((cert) =>
        cert.brand.toLowerCase().includes(searchParams.brand.toLowerCase())
      );
    }

    if (searchParams.saleDate) {
      filtered = filtered.filter(
        (cert) => cert.saleDate && cert.saleDate.includes(searchParams.saleDate)
      );
    }

    if (searchParams.manager) {
      // Фільтрація по менеджеру
      filtered = filtered.filter((cert) =>
        cert.manager.toLowerCase().includes(searchParams.manager.toLowerCase())
      );
    }

    setFilteredCertificates(filtered);
  }, [searchParams, certificates]);

  const handleFormSubmit = async (newCertificate) => {
    try {
      await axios.post("/api/warranty", newCertificate);
      // Після додавання сертифікату оновлюємо список сертифікатів
      const response = await axios.get("/api/warranty");
      setCertificates(response.data);
      setShowForm(false);
    } catch (err) {
      setError("Не вдалося додати сертифікат.");
    }
  };

  const handleResolutionChange = async (id, newResolution) => {
    try {
      const response = await axios.put(`/api/warranty/${id}`, {
        rezolution: newResolution,
      });

      if (response.status === 200) {
        setCertificates((prevCertificates) =>
          prevCertificates.map((cert) =>
            cert._id === id ? { ...cert, rezolution: newResolution } : cert
          )
        );
      }
    } catch (err) {
      console.error("Не вдалося оновити рішення:", err);
    }
  };

  const handleAddCertificate = () => {
    setShowForm(true);
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

  const getRowStyle = (rezolution) => {
    if (rezolution === "ok") {
      return { backgroundColor: "green", color: "white" };
    }
    if (rezolution === "bad") {
      return { backgroundColor: "red", color: "white" };
    }
    return {};
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
              placeholder="Номер талону"
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

            {/* Додано поле для фільтру за менеджером */}
            <input
              className={styles.filterInput}
              type="text"
              name="manager"
              placeholder="Менеджер"
              value={searchParams.manager}
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
                    <th>Затвердження</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id} style={getRowStyle(cert.rezolution)}>
                      <td>{cert.repairNumber}</td>
                      <td>{formatDate(cert.createdAt)}</td>
                      <td>{cert.certificateNumber}</td>
                      <td>{formatDate(cert.saleDate)}</td>
                      <td>{cert.manager}</td>
                      <td>{cert.brand}</td>
                      <td>
                        <span
                          style={{ cursor: "pointer", color: "lightgray" }}
                          onClick={() => redirectToPDF(cert.imageUrl)}
                        >
                          Завантажити PDF
                        </span>
                      </td>
                      <td>
                        <select
                          className={styles.rezolution}
                          name="rezolution"
                          value={cert.rezolution || ""}
                          onChange={(e) =>
                            handleResolutionChange(cert._id, e.target.value)
                          }
                          disabled={
                            cert.rezolution === "ok" ||
                            cert.rezolution === "bad"
                          }
                        >
                          <option value="">Не визначено</option>
                          <option value="ok">Схвалено</option>
                          <option value="bad">Відхилено</option>
                        </select>
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
