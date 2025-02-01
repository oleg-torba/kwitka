"use client";

import React, { useEffect, useState } from "react";
import { FiDownload, FiEdit } from "react-icons/fi";
import styles from "./main.module.css";
import axios from "axios";
import UploadCertificate from "../form/addCertificateForm";

import Loader from "../loader/loader";

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
    manager: "",
  });
  const [currentCertificate, setCurrentCertificate] = useState(null);

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

    const interval = setInterval(fetchCertificates, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = certificates;
    console.log(certificates);
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
      filtered = filtered.filter((cert) =>
        cert.manager.toLowerCase().includes(searchParams.manager.toLowerCase())
      );
    }

    setFilteredCertificates(filtered);
  }, [searchParams, certificates]);
  const handleFormSubmit = async (certificateData) => {
    try {
      console.log(certificateData);
      if (certificateData._id) {
        response = await axios.put(
          `/api/warranty/${certificateData._id}`,
          certificateData
        );
      } else {
        response = await axios.post("/api/warranty", certificateData);
      }

      const updatedCertificates = await axios.get("/api/warranty");

      setCertificates(updatedCertificates.data);

      setShowForm(false);
    } catch (err) {
      setError("Не вдалося додати або оновити сертифікат.");
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

  const handleAddCertificate = async (id) => {
    if (id) {
      try {
        const response = await axios.get(`/api/warranty/${id}`);
        setCurrentCertificate(response.data);
        setShowForm(true);
      } catch (err) {
        setError("Не вдалося завантажити сертифікат.");
      }
    } else {
      setCurrentCertificate(null);
      setShowForm(true);
    }
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
    if (rezolution === "rejected") {
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
            <UploadCertificate
              onSubmit={handleFormSubmit}
              certificate={currentCertificate}
            />
          </div>
        </div>
      )}

      <div>
        <div className={styles.searchForm}>
          <div>
            <button
              className={styles.newBtn}
              onClick={() => handleAddCertificate(null)}
            >
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

        {loading && <Loader />}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <ul>
            {filteredCertificates.length > 0 ? (
              <table className={styles.certificateTable}>
                <thead>
                  <tr className={styles.tableTitle}>
                    <th>Номер ремонту</th>
                    <th>Дата заповнення</th>
                    <th>Бренд</th>
                    <th>Гарантійний талон</th>
                    <th>Запчастина</th>
                    <th>Дата продажу</th>
                    <th>Дані клієнта</th>
                    <th>Менеджер</th>

                    <th>Дії</th>
                    <th>Затвердження</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert) => (
                    <tr key={cert._id} style={getRowStyle(cert.rezolution)}>
                      <td>{cert.repairNumber}</td>
                      <td>{formatDate(cert.createdAt)}</td>
                      <td>{cert.brand}</td>
                      <td>{cert.certificateNumber}</td>
                      <td>{cert.part}</td>
                      <td>{formatDate(cert.saleDate)}</td>
                      <td>{cert.reporting}</td>
                      <td>{cert.manager}</td>

                      <td>
                        <div className={styles.iconsBlock}>
                          <span
                            className={styles.icon}
                            style={{ cursor: "pointer", color: "lightgray" }}
                            onClick={() => redirectToPDF(cert.imageUrl)}
                          >
                            <FiDownload size={15} title="Завантажити PDF" />
                          </span>
                          <span
                            className={`${styles.icon} ${
                              cert.rezolution === "ok" ? styles.disabled : ""
                            }`}
                            onClick={
                              cert.rezolution !== "ok"
                                ? () => handleAddCertificate(cert._id)
                                : undefined
                            }
                          >
                            <FiEdit size={15} title="Редагувати" />
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.tooltipWrapper}>
                          <select
                            className={styles.rezolution}
                            name="rezolution"
                            value={cert.rezolution || ""}
                            onChange={(e) =>
                              handleResolutionChange(cert._id, e.target.value)
                            }
                          >
                            <option value="">Вибрати</option>
                            <option value="ok">Погоджено</option>
                            <option value="rejected">Відхилено</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Немає записів для відображення.</p>
            )}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Header;
