"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./form.module.css";

export default function CertificateForm({
  role,
  mode = "create",
  initialData = null,
  onSubmit,
}) {
  const [repairNumber, setRepairNumber] = useState(
    initialData?.repairNumber || ""
  );
  const [uploading, setUploading] = useState(false);

  const [masterFiles, setMasterFiles] = useState([]);
  const [masterPreviews, setMasterPreviews] = useState([]);
  const [warrantyVerdict, setWarrantyVerdict] = useState(
    initialData?.warrantyVerdict || ""
  );
  const [masterComment, setMasterComment] = useState(initialData?.masterComment || "");
  const [saleDate, setSaleDate] = useState(
    initialData?.saleDate
      ? new Date(initialData.saleDate).toISOString().split("T")[0]
      : ""
  );
  const [certificateNumber, setCertificateNumber] = useState(
    initialData?.certificateNumber || ""
  );
  const [part, setPart] = useState(initialData?.part || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [reporting, setReporting] = useState(initialData?.reporting || "");
  const [manager, setManager] = useState(initialData?.manager || "");
  const [rezolution, setRezolution] = useState(initialData?.rezolution || "");
  const [managerFile, setManagerFile] = useState(null);
  const [master, setMaster] = useState(initialData?.master || "");
  const [managerPreview, setManagerPreview] = useState(
    initialData?.imageUrl || null
  );
  const handleMasterFilesChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.some((f) => !f.type.startsWith("image/"))) {
      toast.error("Дозволено лише зображення");
      return;
    }
    setMasterFiles(selected);
    setMasterPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleManagerFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Дозволено лише зображення");
      return;
    }
    setManagerFile(file);
    setManagerPreview(file ? URL.createObjectURL(file) : null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!repairNumber) {
      toast.error("Номер ремонту обовʼязковий");
      return;
    }

    if (role === "master") {
      if (!warrantyVerdict || masterFiles.length === 0) {
        toast.error("Майстер повинен додати фото і вердикт");
        return;
      }
    }

    if (role === "manager") {
      if (
  !certificateNumber ||
  !manager ||
  !brand ||
  !(managerFile || initialData?.imageUrl) ||
  !saleDate ||
  !reporting
) {
  toast.error(
    "Заповніть усі обов'язкові поля менеджера та завантажте фото"
  );
  return;
}

    }

    setUploading(true);

    try {
      let uploadedMasterImages = [];
      let uploadedManagerUrl = null;
      if (role === "master") {
        for (const file of masterFiles) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
          );

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
          );

          const data = await res.json();
          if (!data.secure_url) throw new Error("Помилка завантаження фото");

          uploadedMasterImages.push({
            url: data.secure_url,
            public_id: data.public_id,
          });
        }
      }
      if (role === "manager" && managerFile) {
        const formData = new FormData();
        formData.append("file", managerFile);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (!data.secure_url) throw new Error("Помилка завантаження фото");

        uploadedManagerUrl = data.secure_url;
      }

      const payload = {
        _id: initialData?._id || null,
        createdBy: role,
        createdAt: new Date().toISOString(),
        warrantyVerdict: warrantyVerdict || "",
        masterImages: uploadedMasterImages || [],
        rezolution: rezolution || null,
        master: master || "",
        repairNumber: repairNumber || "",
        certificateNumber: certificateNumber || "",
        brand: brand || "",
        part: part || "",
        reporting: reporting || "",
        manager: manager || "",
        imageUrl: uploadedManagerUrl || initialData?.imageUrl || null,
        saleDate: saleDate ? new Date(saleDate) : null,
         masterComment: masterComment || "",
        fixationDate:
          rezolution === "ok" || rezolution === "rejected"
            ? new Date().toISOString()
            : null,
      };

      if (mode === "edit" && initialData?._id) {
        payload._id = initialData._id;
      }

      onSubmit(payload);
      console.log(payload)
      toast.success("Дані успішно збережено");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Помилка збереження");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.formBlock}>
      <h2>
        {role === "master"
          ? "Оформлення сертифіката (Майстер)"
          : "Оформлення сертифіката (Менеджер)"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formInput}>
          <label>
          <input
            placeholder="Номер ремонту"
            className={styles.formLabel}
            value={repairNumber}
            onChange={(e) => setRepairNumber(e.target.value)}
          />
          </label>
        </div>

        <div className={styles.formInput}>
          <label>
          <input
            placeholder="Майстер"
            className={styles.formLabel}
            value={master}
            onChange={(e) => setMaster(e.target.value)}
          />
          </label>
        </div>
        {role === "master" && (
          <>
            <div className={styles.formInput}>
              <label>
              <input
               placeholder="Файл (зображення)"
                type="file"
                multiple
                accept="image/*"
                id="masterFileInput"
                hidden
                onChange={handleMasterFilesChange}
              /></label>
              <button
                type="button"
                className={styles.customButton}
                onClick={() =>
                  document.getElementById("masterFileInput").click()
                }
              >
                Додати фото
              </button>
              <div className={styles.previewGrid}>
                {masterPreviews.map((src, i) => (
                  <div key={i} className={styles.previewBox}>
                    <img src={src} alt="" style={{ objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formInput}>
              <label>
              <select
                className={styles.formLabel}
                value={warrantyVerdict}
                onChange={(e) => setWarrantyVerdict(e.target.value)}
              >
                <option value="">Заключення</option>
                <option value="Гарантія">Гарантія</option>
                <option value="Не гарантія">Не гарантія</option>
              </select>
              </label>
            </div>
             <div className={styles.formInput}>
    <label>
    <textarea
      className={styles.formLabelTextarea}
      value={masterComment}
      onChange={(e) => setMasterComment(e.target.value)}
      placeholder="Коментар"
    />
    </label>
  </div>
          </>
        )}

        {role === "manager" && (
          <>
            <div className={styles.formInput}>
              <label>№ гарантійного талону</label>
              <input
                className={styles.formLabel}
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
              />
            </div>

            <div className={styles.formInput}>
              <label>Запчастини</label>
              <input
                className={styles.formLabel}
                value={part}
                onChange={(e) => setPart(e.target.value)}
              />
            </div>

            <div className={styles.formInput}>
              <label>Бренд</label>
              <select
                className={styles.formLabel}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="">Не вказано</option>
                <option value="Makita">Makita</option>
                <option value="Metabo">Metabo</option>
                <option value="Oleo-Mac">Oleo-Mac</option>
              </select>
            </div>
            <div className={styles.formInput}>
              <label>Дата продажу</label>
              <input
                type="date"
                className={styles.formLabel}
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                required
              />
            </div>
            <div className={styles.formInput}>
              <label>Менеджер</label>
              <input
                className={styles.formLabel}
                value={manager}
                onChange={(e) => setManager(e.target.value)}
              />
            </div>
            <div className={styles.formInput}>
              <label>Дані клієнта</label>
              <input
                className={styles.formLabel}
                value={reporting}
                onChange={(e) => setReporting(e.target.value)}
              />
            </div>

            <div className={styles.formInput}>
              <label>Фото</label>
              <input
                type="file"
                accept="image/*"
                id="managerFileInput"
                hidden
                onChange={handleManagerFileChange}
              />
              <button
                type="button"
                className={styles.customButton}
                onClick={() =>
                  document.getElementById("managerFileInput").click()
                }
              >
                Обрати фото
              </button>
              {managerPreview && (
                <div className={styles.previewBox}>
                  <img
                    src={managerPreview}
                    alt=""
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </div>

            <div className={styles.formInput}>
              <label>Резолюція</label>
              <select
                className={styles.formLabel}
                value={rezolution}
                onChange={(e) => setRezolution(e.target.value)}
              >
                <option value="">На погодженні</option>
                <option value="ok">Погоджено</option>
                <option value="rejected">Відхилено</option>
              </select>
            </div>
          </>
        )}

        <button type="submit" disabled={uploading} className={styles.submitBtn}>
          {uploading ? "Збереження..." : "Зберегти"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}
