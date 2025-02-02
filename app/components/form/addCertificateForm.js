"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import styles from "./form.module.css";

export default function UploadCertificate({ onSubmit, certificate }) {
  const [file, setFile] = useState(null);
  const [repairNumber, setRepairNumber] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [part, setPart] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [reporting, setReporting] = useState("");
  const [manager, setManager] = useState("");
  const [brand, setBrand] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (certificate) {
      setRepairNumber(certificate.repairNumber || "");
      setCertificateNumber(certificate.certificateNumber || "");
      setPart(certificate.part || "");
      setSaleDate(
        certificate.saleDate ? certificate.saleDate.split("T")[0] : ""
      );
      setReporting(certificate.reporting || "");
      setManager(certificate.manager || "");
      setBrand(certificate.brand || "");
      setFile(null);
    } else {
      setRepairNumber("");
      setCertificateNumber("");
      setPart("");
      setSaleDate("");
      setReporting("");
      setManager("");
      setBrand("");
      setFile(null);
    }
  }, [certificate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast.error("Будь ласка, виберіть файл у форматі PDF.");
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !repairNumber ||
      !certificateNumber ||
      !part ||
      !saleDate ||
      !reporting ||
      !manager ||
      !brand ||
      (!file && !certificate?.imageUrl)
    ) {
      toast.warning("Будь ласка, заповніть усі поля.");
      return;
    }

    setUploading(true);

    try {
      let uploadedFileUrl = certificate?.imageUrl;
      let uploadedFilePublicId = certificate?.public_id;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "warranty");
        formData.append("resource_type", "raw");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/ds38ymgr5/raw/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Помилка завантаження файлу.");
        }

        const data = await response.json();
        uploadedFileUrl = data.secure_url;
        uploadedFilePublicId = data.public_id;
      }

      const dataToSubmit = {
        repairNumber,
        certificateNumber,
        part,
        saleDate,
        reporting,
        manager,
        brand,
        imageUrl: uploadedFileUrl,
        public_id: uploadedFilePublicId,
        createdAt: certificate
          ? certificate.createdAt
          : new Date().toISOString(),
        _id: certificate ? certificate._id : null,
      };

      onSubmit(dataToSubmit);
      toast.success("Дані успішно оновлені");
    } catch (err) {
      toast.error(err.message || "Помилка збереження даних");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.formBlock}>
      <h2>
        {certificate ? "Редагування документу" : "Форма завантаження звіту"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <div className={styles.formInput}>
            <label htmlFor="repairNumber">Номер ремонту:</label>
            <input
              className={styles.formLabel}
              type="text"
              id="repairNumber"
              value={repairNumber}
              onChange={(e) => setRepairNumber(e.target.value)}
              required
            />
          </div>

          <div className={styles.formInput}>
            <label htmlFor="certificateNumber">
              Номер гарантійного талону:
            </label>
            <input
              className={styles.formLabel}
              type="text"
              id="certificateNumber"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              required
            />
          </div>

          <div className={styles.formInput}>
            <label htmlFor="part">Використана запчастина:</label>
            <input
              className={styles.formLabel}
              type="text"
              id="part"
              value={part}
              onChange={(e) => setPart(e.target.value)}
              required
            />
          </div>

          <div className={styles.formInput}>
            <label htmlFor="file" className={styles.fileLabel}>
              Завантажте файл (PDF):
            </label>
            <input
              id="file"
              className={styles.fileInput}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className={styles.customButton}
              onClick={() => document.getElementById("file").click()}
            >
              Обрати файл
            </button>

            {file && <p>Вибрано файл: {file.name}</p>}
            {certificate && !file && certificate.imageUrl && (
              <p>
                Файл:{" "}
                <a
                  href={certificate.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Переглянути
                </a>
              </p>
            )}
          </div>
        </div>

        <div>
          <div className={styles.formInput}>
            <label htmlFor="saleDate">Дата продажу:</label>
            <input
              className={styles.formLabel}
              type="date"
              id="saleDate"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              required
            />
          </div>

          <div className={styles.formInput}>
            <label htmlFor="reporting">Дані клієнта</label>
            <input
              id="reporting"
              className={styles.formLabel}
              value={reporting}
              onChange={(e) => setReporting(e.target.value)}
              required
            />
          </div>

          <div className={styles.formInput}>
            <label htmlFor="manager">Менеджер:</label>
            <select
              className={styles.formLabel}
              id="manager"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              required
            >
              <option value="">Виберіть менеджера</option>
              <option value="Олег">Олег</option>
              <option value="Денис">Денис</option>
              <option value="Авіна">Авіна</option>
            </select>
          </div>

          <div className={styles.formInput}>
            <label htmlFor="brand">Бренд:</label>
            <select
              className={styles.formLabel}
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            >
              <option value="">Виберіть бренд</option>
              <option value="Makita">Makita</option>
              <option value="Metabo">Metabo</option>
              <option value="Oleo-Mac">Oleo-Mac</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={styles.submitBtn}
          >
            {uploading
              ? "Завантаження"
              : certificate
              ? "Оновити"
              : "Відправити"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
