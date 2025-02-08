"use client";

import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { CgArrowDownR } from "react-icons/cg";
import { FiTrash } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import styles from "./main.module.css";
import axios from "axios";
import UploadCertificate from "../form/addCertificateForm";
import { motion, AnimatePresence } from "framer-motion";

import Loader from "../loader/loader";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import PasswordModal from "../Modal/passwordModal";

const Header = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [searchParams, setSearchParams] = useState({
    repairNumber: "",
    certificateNumber: "",
    brand: "",
    saleDate: null,
    manager: "",
    rezolution: "",
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
        setError(err);
        setLoading(false);
        toast.error("Не вдалося підключитися до сервера.");
      }
    };

    fetchCertificates();

    const interval = setInterval(fetchCertificates, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = [...certificates];

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
        cert.brand?.toLowerCase().includes(searchParams.brand.toLowerCase())
      );
    }

    if (searchParams.saleDate) {
      filtered = filtered.filter(
        (cert) =>
          cert.saleDate && String(cert.saleDate).includes(searchParams.saleDate)
      );
    }

    if (searchParams.manager) {
      filtered = filtered.filter((cert) =>
        cert.manager?.toLowerCase().includes(searchParams.manager.toLowerCase())
      );
    }
    if (searchParams.rezolution) {
      filtered = filtered.filter((cert) =>
        cert.rezolution
          ?.toLowerCase()
          .includes(searchParams.rezolution.toLowerCase())
      );
    }
    setFilteredCertificates(filtered);
  }, [
    certificates,
    searchParams.brand,
    searchParams.certificateNumber,
    searchParams.manager,
    searchParams.repairNumber,
    searchParams.resolution,
    searchParams.saleDate,
    searchParams.rezolution,
  ]);

  const handleFormSubmit = async (certificateData) => {
    try {
      if (certificateData._id) {
        await axios.put(
          `/api/warranty/${certificateData._id}`,
          certificateData
        );
      } else {
        await axios.post("/api/warranty", certificateData);
      }

      const response = await axios.get("/api/warranty");
      setCertificates(response.data);
      setShowForm(false);
      toast.success("Дані завантажено.");
    } catch (err) {
      setError(err);
      toast.error("Помилка при оновленні даних.");
    }
  };

  const handleAddCertificate = async (id) => {
    if (id) {
      setPendingAction(() => async () => {
        try {
          const response = await axios.get(`/api/warranty/${id}`);
          setCurrentCertificate(response.data);
          setLoading(false);
          setShowForm(true);
        } catch (err) {
          setError("Не вдалося завантажити сертифікат.");
          toast.error("Не вдалося завантажити сертифікат.");
        }
      });
      setPasswordModalOpen(true);
    } else {
      setCurrentCertificate(null);
      setShowForm(true);
    }
  };

  const handleDeleteCertificate = (id) => {
    setPendingAction(() => async () => {
      try {
        await axios.delete(`/api/warranty/${id}`);
        setCertificates((prevCertificates) =>
          prevCertificates.filter((cert) => cert._id !== id)
        );
        setTimeout(() => {
          setFilteredCertificates((prev) =>
            prev.filter((cert) => cert._id !== id)
          );
        }, 700);
        toast.success("Сертифікат успішно видалено!");
      } catch (err) {
        toast.error("Не вдалося видалити сертифікат.");
      } finally {
      }
    });
    setPasswordModalOpen(true);
  };

  const handlePasswordCheck = (password) => {
    if (password === "1122") {
      if (pendingAction) {
        pendingAction();
        setPasswordModalOpen(false);
      }
    } else {
      toast.error("Невірний пароль!");
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
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
        setCertificates((prevCertificates) => {
          const updatedCertificates = prevCertificates.map((cert) =>
            cert._id === id ? { ...cert, ...updateData } : cert
          );

          let filtered = [...updatedCertificates];

          if (searchParams.rezolution) {
            filtered = filtered.filter((cert) =>
              cert.rezolution
                ?.toLowerCase()
                .includes(searchParams.rezolution.toLowerCase())
            );
          }

          setFilteredCertificates(filtered);
          toast.success("Дані успішно оновлено.");
          return updatedCertificates;
        });
      }
    } catch (err) {
      console.error("Не вдалося оновити рішення:", err);
      toast.error("Помилка оновлення даних");
    }
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
      return { backgroundColor: "red", color: "white", opacity: 0.8 };
    }
    return {};
  };

  const redirectToPDF = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
    toast.info("Завантаження PDF...");
  };

  return (
    <main className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className={styles.head}>
          <h1>Звіт по гарантійних ремонтах </h1>
        </div>
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <span
                    className={styles.close}
                    onClick={() => setShowForm(false)}
                  >
                    &times;
                  </span>
                  <UploadCertificate
                    onSubmit={handleFormSubmit}
                    certificate={currentCertificate}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isPasswordModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <span
                    className={styles.close}
                    onClick={() => setPasswordModalOpen(false)}
                  >
                    &times;
                  </span>
                  <PasswordModal onConfirm={handlePasswordCheck} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div>
          <div className={styles.searchForm}>
            <div>
              <span
                className={styles.newBtn}
                onClick={() => handleAddCertificate(null)}
              >
                Додати новий
              </span>
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
              <label htmlFor="brand-select"></label>
              <select
                id="brand-select"
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

              <div>
                <label htmlFor="rezolution-select"></label>
                <select
                  id="rezolution-select"
                  className={styles.filterInput}
                  name="rezolution"
                  value={searchParams.rezolution}
                  onChange={handleSearchChange}
                >
                  <option value="">Рішення</option>

                  <option value="ok">Прийнято</option>
                  <option value="rejected">Відхилено</option>
                </select>
              </div>
            </div>
          </div>

          {loading && <Loader />}

          {!loading && !error && (
            <ul>
              {certificates.length > 0 ? (
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
                      <tr key={cert._id}>
                        <td>{cert.repairNumber}</td>
                        <td>{formatDate(cert.createdAt)}</td>
                        <td>{cert.brand}</td>
                        <td>{cert.certificateNumber}</td>
                        <td>{cert.part}</td>
                        <td>{formatDate(cert.saleDate)}</td>
                        <td>
                          <div className={styles.user}>
                            <FiUser size={15} />
                            <span>{cert.reporting}</span>
                          </div>
                        </td>
                        <td>{cert.manager}</td>

                        <td>
                          <div className={styles.iconsBlock}>
                            <span
                              className={styles.icon}
                              onClick={() => redirectToPDF(cert.imageUrl)}
                            >
                              <CgArrowDownR size={15} title="Завантажити PDF" />
                            </span>
                            <span
                              className={styles.icon}
                              onClick={() => handleAddCertificate(cert._id)}
                            >
                              <FiEdit size={15} title="Редагувати" />
                            </span>
                            <span
                              className={styles.icon}
                              onClick={() => handleDeleteCertificate(cert._id)}
                            >
                              <FiTrash size={15} title="Видалити" />
                            </span>
                          </div>
                        </td>
                        <td style={getRowStyle(cert.rezolution)}>
                          <div className={styles.tooltipWrapper}>
                            <label htmlFor={`rezolution-${cert._id}`}></label>
                            <select
                              id={`rezolution-${cert._id}`}
                              className={styles.rezolution}
                              name="rezolution"
                              value={cert.rezolution || ""}
                              onChange={(e) =>
                                handleResolutionChange(cert._id, e.target.value)
                              }
                            >
                              <option value="">На погодженні</option>
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
                <p>Сертифікатів не знайдено</p>
              )}
            </ul>
          )}
        </div>
      </motion.div>
      <ToastContainer />
    </main>
  );
};

export default Header;
