"use client";

import React, { useState } from "react";
import styles from "./form.module.css";
export default function UploadCertificate({ onSubmit }) {
  const [file, setFile] = useState(null);
  const [repairNumber, setRepairNumber] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [part, setPart] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [reporting, setReporting] = useState("");
  const [manager, setManager] = useState("");
  const [brand, setBrand] = useState(""); // Додано нове поле для бренду
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setError("Будь ласка, виберіть файл у форматі PDF.");
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !file ||
      !repairNumber ||
      !certificateNumber ||
      !part ||
      !saleDate ||
      !reporting ||
      !manager ||
      !brand // Перевіряємо, чи вибрано бренд
    ) {
      setError("Будь ласка, заповніть усі поля і виберіть файл.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Завантаження файлу на Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "warranty");
      formData.append("resource_type", "raw");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/ds38ymgr5/raw/upload", // Використовуємо raw/upload для PDF
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Помилка завантаження файлу.");
      }

      const data = await response.json();
      const uploadedFileUrl = data.secure_url;

      const dataToSubmit = {
        repairNumber,
        certificateNumber,
        part,
        saleDate,
        reporting,
        manager,
        brand, // Додаємо бренд до даних для відправки
        imageUrl: uploadedFileUrl,
        createdAt: new Date().toISOString(), // Додаємо дату заповнення
      };

      onSubmit(dataToSubmit);
    } catch (err) {
      console.error(err);
      setError("Сталася помилка під час завантаження або відправки даних.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.form}>
      <h2>Форма завантаження звіту</h2>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="certificateNumber">Номер гарантійного талону:</label>
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
          <label htmlFor="reporting">Коментар:</label>
          <textarea
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
            <option value="Іван">Іван</option>
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
            <option value="Bosch">Bosch</option>
            <option value="Makita">Makita</option>
            <option value="Metabo">Metabo</option>
            <option value="Oleo-Mac">Oleo-Mac</option>
          </select>
        </div>

        <div className={styles.formInput}>
          <label htmlFor="file">Виберіть файл (PDF):</label>
          <input
            className={styles.formLabel}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
          {file && <p>Вибрано файл: {file.name}</p>}
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? "Завантаження.." : "Відправити"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
