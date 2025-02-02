"use client";

import React, { useEffect, useState } from "react";
import { FiDownload, FiEdit } from "react-icons/fi";
import { FiTrash } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import styles from "./main.module.css";
import axios from "axios";
import UploadCertificate from "../form/addCertificateForm";

import Loader from "../loader/loader";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { PasswordModal } from "../Modal/passwordModal";

const Header = () => {
  const [certificates, setCertificates] = useState([]);
  const [actionType, setActionType] = useState(null);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setshowPasswordForm] = useState(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
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
        const source = axios.CancelToken.source();
        setTimeout(() => source.cancel(), 5000);
        const response = await axios.get("/api/warranty");
        setCertificates(response.data);
        setFilteredCertificates(response.data);
        setLoading(false);
        toast.success("Сертифікати успішно завантажено.");
      } catch (err) {
        setError(err);
        setLoading(false);

        if (axios.isCancel(error)) {
          console.error("Запит скасовано:", error.message);
        } else {
          console.error("Помилка сервера:", error);
          toast.error("Не вдалося підключитися до сервера.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();

    const interval = setInterval(fetchCertificates, 300000);

    return () => clearInterval(interval);
  }, [error]);

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
      filtered = filtered.filter((cert) =>
        cert.manager.toLowerCase().includes(searchParams.manager.toLowerCase())
      );
    }

    setFilteredCertificates(filtered);
  }, [searchParams, certificates]);

  const handleFormSubmit = async (certificateData) => {
    try {
      let response;
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
      toast.success("Дані успішно завантажено.");
    } catch (err) {
      setError(err);
      toast.error(error);
    }
  };

  const handleResolutionChange = async (id, newResolution) => {
    try {
      const updateData = {
        rezolution: newResolution,
      };

      if (newResolution === "ok" || newResolution === "rejected") {
        updateData.fixationDate = new Date().toISOString();
      }

      const response = await axios.put(`/api/warranty/${id}`, updateData);

      if (response.status === 200) {
        setCertificates((prevCertificates) =>
          prevCertificates.map((cert) =>
            cert._id === id ? { ...cert, ...updateData } : cert
          )
        );
        toast.success("Дані успішно оновлено.");
      }
    } catch (err) {
      console.error("Не вдалося оновити рішення:", err);
      toast.error("Помилка оновлення даних");
    }
  };

  const handleAddCertificate = async (id) => {
    if (id) {
      try {
        const response = await axios.get(`/api/warranty/${id}`);
        setCurrentCertificate(response.data);
        setShowForm(false);
        setshowPasswordForm(true);
      } catch (err) {
        setError("Не вдалося завантажити сертифікат.");
        toast.error(error.message);
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
      return { backgroundColor: "darkcyan", color: "white" };
    }
    if (rezolution === "rejected") {
      return { backgroundColor: "red", color: "pink" };
    }
    return {};
  };

  const redirectToPDF = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
    toast.info("Завантаження PDF...");
  };

  const handleDeleteCertificate = async (certificateId) => {
    try {
      await axios.delete(`/api/warranty/${certificateId}`);
      setCertificates((prevCertificates) =>
        prevCertificates.filter((cert) => cert._id !== certificateId)
      );
      toast.success("Сертифікат успішно видалено!");
      setshowPasswordForm(false);
    } catch (err) {
      toast.error(err);
    }
  };

  // const openPasswordModal = (certificateId) => {
  //   setCurrentCertificate(certificateId);
  //   setshowPasswordForm(true);
  // };

  const openPasswordModalForDelete = (certificateId) => {
    setCurrentCertificate(certificateId);
    setActionType("delete");
    setshowPasswordForm(true);
  };

  const openPasswordModalForEdit = (certificateId) => {
    setCurrentCertificate(certificateId);
    setActionType("edit");
    setshowPasswordForm(true);
  };

  const handlePasswordSubmit = (password) => {
    if (password === "1122") {
      if (actionType === "delete") {
        handleDeleteCertificate(certificateToDelete);
      } else if (actionType === "edit") {
        setShowForm(true);
      }
      setshowPasswordForm(false);
      setActionType(null);
    } else {
      toast.error("Невірний пароль!");
      setshowPasswordForm(false);
      setActionType(null);
    }
  };
  const closePasswordModal = () => {
    setshowPasswordForm(false);
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

      {showPasswordForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => closePasswordModal()}>
              &times;
            </span>
            <PasswordModal
              isOpen={openPasswordModalForDelete && openPasswordModalForEdit}
              onSubmit={handlePasswordSubmit}
            />
          </div>
        </div>
      )}

      {isPasswordCorrect && showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setShowForm(false)}>
              &times;
            </span>
            <UploadCertificate
              certificate={currentCertificate}
              onSubmit={handleFormSubmit}
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
                      <td>
                        <div className={styles.user}>
                          <FiUser size={15} />
                          <span> {cert.reporting}</span>
                        </div>
                      </td>
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
                          {/* <span
                            className={styles.icon}
                            onClick={() => openPasswordModalForEdit(cert._id)}
                          >
                            <FiEdit size={15} title="Редагувати" />
                          </span>
                          <span
                            className={styles.icon}
                            style={{ cursor: "pointer", color: "lightgray" }}
                            onClick={() => openPasswordModalForDelete(cert._id)}
                          >
                            <FiTrash size={15} title="Видалити" />
                          </span> */}
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
                          {cert.rezolution !== "" && (
                            <p>
                              Дата:{" "}
                              {new Date(cert.fixationDate).toLocaleDateString(
                                "uk-UA"
                              )}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Не знайдено сертифікатів</p>
            )}
          </ul>
        )}
      </div>
      <ToastContainer />
    </main>
  );
};

export default Header;
