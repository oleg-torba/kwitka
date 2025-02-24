"use client";

import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { CgArrowDownR } from "react-icons/cg";
import { FiTrash } from "react-icons/fi";
import styles from "./page.module.css";
import axios from "axios";
import UploadCertificate from "../components/form/addCertificateForm";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";

import Loader from "../components/loader/loader";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import PasswordModal from "../components/Modal/passwordModal";
import FilterComponent from "../components/sidebar/sidebar";

const WarranrtyService = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [filteredData, setFilteredData] = useState([]);
  const [currentCertificate, setCurrentCertificate] = useState(null);

  useEffect(() => {
    const fetchCertificates = async (page = 1) => {
      try {
        const response = await axios.get(
          `https://node-kwitka.onrender.com/api/warranty?page=${page}&limit=5`
        );
        setCertificates(response.data.data);
        setTotalPages(response.data.totalPages);

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        toast.error("Помилка при завантаженні даних", err);
      }
    };

    fetchCertificates(currentPage);

    const interval = setInterval(fetchCertificates, 300000);
    return () => clearInterval(interval);
  }, [currentPage, error]);

  const handleFormSubmit = async (certificateData) => {
    try {
      if (certificateData._id) {
        await axios.put(
          `https://node-kwitka.onrender.com/api/warranty/${certificateData._id}`,
          certificateData
        );
      } else {
        await axios.post(
          "https://node-kwitka.onrender.com/api/warranty/addWarranty",
          certificateData
        );
      }

      const response = await axios.get(
        "https://node-kwitka.onrender.com/api/warranty/"
      );

      setCertificates((prev) =>
        prev.map((cert) =>
          cert._id === response.data.data._id ? response.data.data : cert
        )
      );
      setShowForm(false);

      toast.success("Дані завантажено.");
    } catch (err) {
      setError(err);
      toast.error("Помилка при оновленні даних.");
    }
  };

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...certificates].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setCertificates(sortedData);
  };

  const handleAddCertificate = async (id) => {
    if (id) {
      setPendingAction(() => async () => {
        try {
          const response = await axios.get(
            `https://node-kwitka.onrender.com/api/warranty/${id}`
          );
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
        await axios.delete(
          `https://node-kwitka.onrender.com/api/warranty/${id}`
        );
        setCertificates((prevCertificates) =>
          prevCertificates.filter((cert) => cert._id !== id)
        );

        toast.success("Сертифікат успішно видалено!");
        playSound();
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

  const handleResolutionChange = async (id, newResolution) => {
    try {
      const updateData = {
        rezolution: newResolution,
      };

      if (newResolution === "ok" || newResolution === "rejected") {
        updateData.fixationDate = new Date().toISOString();
      }

      const response = await axios.put(
        `https://node-kwitka.onrender.com/api/warranty/${id}`,
        updateData
      );

      if (response.status === 200) {
        toast.success("Дані успішно оновлено.");
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

  const redirectToPDF = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
    toast.info("Завантаження PDF...");
  };
  const getStatusIcon = (rezolution) => {
    if (rezolution === "ok") {
      return <FaCheck size={15} color="lightgreen" title="Погоджено" />;
    }
    if (rezolution === "rejected") {
      return <MdClose size={15} color="red" title="Відхилено" />;
    }
    return <FiClock size={15} color="gray" title="На погодженні" />;
  };

  return (
    <div>
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

        <div className={styles.searchForm}>
          <div>
            <span
              className={styles.newBtn}
              onClick={() => handleAddCertificate(null)}
            >
              Додати
            </span>
          </div>
        </div>
        <div className={styles.filterBlock}>
          {loading && <Loader />}

          {!loading && !error && (
            <div>
              {filteredData.length > 0 && (
                <table className={styles.certificateTable}>
                  <thead>
                    <tr className={styles.tableTitle}>
                      <th onClick={() => sortData("repairNumber")}>
                        № ремонту
                      </th>
                      <th onClick={() => sortData("createdAt")}>
                        Дата заповнення
                      </th>
                      <th onClick={() => sortData("brand")}>Бренд</th>
                      <th onClick={() => sortData("certificateNumber")}>
                        Талон
                      </th>
                      <th onClick={() => sortData("part")}>Запчастина</th>
                      <th onClick={() => sortData("saleDate")}>Дата продажу</th>
                      <th onClick={() => sortData("reporting")}>
                        Дані клієнта
                      </th>
                      <th onClick={() => sortData("manager")}>Менеджер</th>
                      <th>Дії</th>
                      <th onClick={() => sortData("rezolution")}>
                        Затвердження
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((cert) => (
                      <tr key={cert._id}>
                        <td>{cert.repairNumber}</td>
                        <td>{formatDate(cert.createdAt)}</td>
                        <td>{cert.brand}</td>
                        <td>{cert.certificateNumber}</td>
                        <td>{cert.part}</td>
                        <td>{formatDate(cert.saleDate)}</td>
                        <td>
                          <div className={styles.user}>
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
                        <td>
                          <div>
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
                          </div>
                          {cert.rezolution !== "" && (
                            <p>
                              {new Date(cert.fixationDate).toLocaleDateString(
                                "uk-UA"
                              )}
                            </p>
                          )}
                          <div className={styles.statusIcon}>
                            {getStatusIcon(cert.rezolution)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {certificates.length > 0 && (
            <FilterComponent
              data={certificates}
              setFilteredData={setFilteredData}
            />
          )}
          {filteredData.length < 0 && <p>Не вдалось завантажити дані</p>}
        </div>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default WarranrtyService;
