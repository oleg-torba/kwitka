"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
import UploadCertificate from "../components/form/addCertificateForm";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showModal, setShowModal] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [currentCertificate, setCurrentCertificate] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://node-kwitka.onrender.com/api/warranty`,
          { signal: controller.signal }
        );
        setCertificates(response.data.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err);
        toast.error("Помилка при завантаженні даних");
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
    return () => controller.abort();
  }, []);

  const checkAndUpdateResolutions = useCallback(async () => {
    const now = new Date();

    const updates = certificates
      .filter((cert) => {
        if (cert.rezolution !== "") return false;

        const createdAt = new Date(cert.createdAt);
        const autoApprovalDate = new Date(createdAt);
        autoApprovalDate.setDate(autoApprovalDate.getDate() + 5);

        return now >= autoApprovalDate;
      })
      .map((cert) => ({
        id: cert._id,
        rezolution: "ok",
        autoApproved: true,
        fixationDate: new Date().toISOString(),
      }));

    if (updates.length === 0) return;

    try {
      await Promise.all(
        updates.map(({ id, ...rest }) =>
          axios.put(
            `https://node-kwitka.onrender.com/api/warranty/edit/${id}`,
            rest
          )
        )
      );

      setCertificates((prev) =>
        prev.map((cert) =>
          updates.find((upd) => upd.id === cert._id)
            ? { ...cert, ...updates.find((upd) => upd.id === cert._id) }
            : cert
        )
      );

      toast.success("Автоматично погоджено прострочені сертифікати");
    } catch (err) {
      console.error("Помилка оновлення резолюції", err);
      toast.error("Помилка при автопогодженні");
    }
  }, [certificates]);

  useEffect(() => {
    if (certificates.length > 0) {
      checkAndUpdateResolutions();
    }
  }, [certificates, checkAndUpdateResolutions]);

  useEffect(() => {
    let filtered = [...certificates];

    if (searchParams.rezolution) {
      filtered = filtered.filter((cert) =>
        cert.rezolution
          ?.toLowerCase()
          .includes(searchParams.rezolution.toLowerCase())
      );
    }

    const sortedData = filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setFilteredData(sortedData);
  }, [certificates, searchParams.rezolution]);

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
        setLoading(true);
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
        setPendingAction(null);
      }
      setPasswordModalOpen(false);
    } else {
      toast.error("Невірний пароль!");
    }
  };

  const handleResolutionChange = async (id, newResolution) => {
    try {
      const updateData = {
        rezolution: newResolution,
        fixationDate: ["ok", "rejected"].includes(newResolution)
          ? new Date().toISOString()
          : undefined,
      };

      setCertificates((prev) =>
        prev.map((cert) =>
          cert._id === id ? { ...cert, ...updateData } : cert
        )
      );

      await axios.put(
        `https://node-kwitka.onrender.com/api/warranty/${id}`,
        updateData
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

  return (
    <div>
      {loading && <Loader />}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className={styles.head}>Звіт по гарантійних ремонтах </h1>

        <div className={styles.rules}>
          <span>
            *Без проведеного гарантійного талону товар клієнту не
            відвантажується
          </span>
          <span>*На погодження або відхилення надається термін 5 днів</span>
          <span>
            *Якщо на протязі 5 днів немає підтвердження - гарантія автоматично
            погоджена
          </span>
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
        <AnimatePresence>
          {showModal && (
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
                    onClick={() => setShowModal(false)}
                  >
                    &times;
                  </span>
                  <h3>В базі даних відсутні записи по заданому параметру</h3>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={styles.searchForm}>
          <span className={styles.newBtn} onClick={checkAndUpdateResolutions}>
            Запустити авто-погодження
          </span>
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
          {!loading && !error && (
            <>
              <div className={styles.scroll}>
                <CertificateTable
                  data={filteredData}
                  onEdit={handleAddCertificate}
                  onDelete={handleDeleteCertificate}
                  onDownload={redirectToPDF}
                  onResolutionChange={handleResolutionChange}
                />
              </div>

              <FilterComponent
                showModal={showModal}
                setShowModal={setShowModal}
                data={certificates}
                setFilteredData={setFilteredData}
              />
            </>
          )}
        </div>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default WarranrtyService;
