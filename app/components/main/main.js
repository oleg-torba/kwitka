"use client";

import React, { useEffect, useState } from "react";
import styles from "./main.module.css";
import axios from "axios";
import UploadCertificate from "../form/addCertificateForm";

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
    saleDate: "",
  });

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get("/api/warranty");
        setCertificates(response.data);
        setFilteredCertificates(response.data); // Зберігаємо всі сертифікати для фільтрації
        setLoading(false);
      } catch (err) {
        setError("Не вдалося завантажити сертифікати.");
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

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

  const handleSearch = () => {
    const { repairNumber, certificateNumber, brand, saleDate } = searchParams;
    const filtered = certificates.filter((cert) => {
      return (
        (repairNumber ? cert.repairNumber.includes(repairNumber) : true) &&
        (certificateNumber
          ? cert.certificateNumber.includes(certificateNumber)
          : true) &&
        (brand ? cert.brand.includes(brand) : true) &&
        (saleDate ? cert.saleDate.includes(saleDate) : true)
      );
    });
    setFilteredCertificates(filtered);
  };

  // Функція для скидання фільтра
  const handleResetFilter = () => {
    setSearchParams({
      repairNumber: "",
      certificateNumber: "",
      brand: "",
      saleDate: "",
    });
    setFilteredCertificates(certificates); // Відновлюємо всі сертифікати
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Функція для перенаправлення на PDF
  const redirectToPDF = (pdfUrl) => {
    window.open(pdfUrl, "_blank"); // Відкриває PDF у новій вкладці
  };

  return (
    <main className={styles.container}>
      <div className={styles.head}>
        <h1>Звіт по гарантійних ремонтах </h1>
      </div>

      {/* Модальне вікно */}
      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span
              className={styles.close}
              onClick={() => setShowForm(false)} // Закрити модальне вікно
            >
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
          <div>
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
            <input
              className={styles.filterInput}
              type="text"
              name="brand"
              placeholder="Бренд"
              value={searchParams.brand}
              onChange={handleSearchChange}
            />
            <input
              className={styles.filterInput}
              type="date"
              name="saleDate"
              value={searchParams.saleDate}
              onChange={handleSearchChange}
            />
            <button className={styles.newBtn} onClick={handleSearch}>
              Пошук
            </button>
            <button className={styles.clear} onClick={handleResetFilter}>
              Скинути фільтр
            </button>{" "}
            {/* Кнопка для скидання фільтру */}
          </div>
        </div>

        {loading && <p>Завантаження гарантійних ремонтів...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <ul>
            {filteredCertificates.length > 0 ? (
              <table className={styles.certificateTable}>
                <thead>
                  <tr>
                    <th>Номер ремонту</th>
                    <th>Дата заповнення</th>
                    <th>Гарантійний талон</th>
                    <th>Дата продажу</th>
                    <th>Менеджер</th>
                    <th>Бренд</th> {/* Додано бренд */}
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id}>
                      <td>{cert.repairNumber}</td>
                      <td>{cert.createdAt}</td>
                      <td>{cert.certificateNumber}</td>
                      <td>{formatDate(cert.saleDate)}</td>
                      <td>{cert.manager}</td>
                      <td>{cert.brand}</td> {/* Виведення бренду */}
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
