"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import FilterComponent from "../components/filterPanel/filterPanel";
import CertificateTable from "../components/table/certificateTable";

const WarranrtyService = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useState({
    brand: "",
    saleDate: null,
    manager: "",
    rezolution: "",
  });
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [filteredData, setFilteredData] = useState([]);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const sortData = (key) => {
    let direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sorted = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
  };
  useEffect(() => {
    const controller = new AbortController();

    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          `https://node-kwitka.onrender.com/api/warranty`,
          { signal: controller.signal }
        );
        setCertificates(response.data.data);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err);
        toast.error("Помилка при завантаженні даних");
      }
    };

    fetchCertificates();
  }, []);

  useEffect(() => {
    let filtered = [...certificates];

    if (searchParams.rezolution) {
      filtered = filtered.filter((cert) =>
        cert.rezolution
          ?.toLowerCase()
          .includes(searchParams.rezolution.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [searchParams, certificates]);
  const handleFormSubmit = async (certificateData) => {
    try {
      let response;
      if (certificateData._id) {
        response = await axios.put(
          `https://node-kwitka.onrender.com/api/warranty/${certificateData._id}`,
          certificateData
        );
      } else {
        response = await axios.post(
          "https://node-kwitka.onrender.com/api/warranty/addWarranty",
          certificateData
        );
      }

      setCertificates((prev) => {
        if (certificateData._id) {
          return prev.map((cert) =>
            cert._id === response.data.data_id ? response.data.data : cert
          );
        }
        return [...prev, response.data.data];
      });

      setShowForm(false);
      toast.success("Дані успішно оновлено.");
    } catch (err) {
      toast.error("Помилка при оновленні даних.");
    }
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

  const handleDeleteCertificate = useCallback((id) => {
    setPendingAction(() => async () => {
      try {
        await axios.delete(
          `https://node-kwitka.onrender.com/api/warranty/${id}`
        );
        setCertificates((prev) => prev.filter((cert) => cert._id !== id));
        toast.success("Сертифікат успішно видалено!");
      } catch (err) {
        toast.error("Не вдалося видалити сертифікат.");
      }
    });
    setPasswordModalOpen(true);
  }, []);

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
      const updateData = { rezolution: newResolution };

      if (["ok", "rejected"].includes(newResolution)) {
        updateData.fixationDate = new Date().toISOString();
      }

      const { data } = await axios.put(
        `https://node-kwitka.onrender.com/api/warranty/${id}`,
        updateData
      );

      setCertificates((prev) =>
        prev.map((cert) => (cert._id === id ? data : cert))
      );
      toast.success("Дані успішно оновлено.");
    } catch (err) {
      toast.error("Помилка оновлення даних.");
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
            <div className={styles.scroll}>
              {filteredData.length > 0 && (
                <CertificateTable
                  data={filteredData}
                  onEdit={handleAddCertificate}
                  onDelete={handleDeleteCertificate}
                  onDownload={redirectToPDF}
                  onResolutionChange={handleResolutionChange}
                />
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
