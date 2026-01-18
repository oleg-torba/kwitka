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

  const [warrantyVerdict, setWarrantyVerdict] = useState(
    initialData?.warrantyVerdict || ""
  );
  const [masterComment, setMasterComment] = useState(
    initialData?.masterComment || ""
  );
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
  const [rezolution, setRezolution] = useState(initialData?.rezolution || "default");
  const [master, setMaster] = useState(initialData?.master || "");

  const [managerFile, setManagerFile] = useState(null);

  const handleMasterFilesChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.some((f) => !f.type.startsWith("image/"))) {
      toast.error("Дозволено лише зображення");
      return;
    }
    setMasterFiles(selected);
  };

  const handleManagerFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Дозволено лише зображення");
      return;
    }
    setManagerFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!repairNumber) {
      toast.error("Номер ремонту обовʼязковий");
      return;
    }

    if (role === "master") {
      if (
        !warrantyVerdict ||
        (masterFiles.length === 0 && !initialData?.masterImages?.length)
      ) {
        toast.error("Майстер повинен додати фото і вердикт");
        return;
      }
    }

    if (role === "manager") {
      if (
        rezolution === "default" ||
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
      let uploadedMasterImages = initialData?.masterImages || [];
      let uploadedManagerUrl = initialData?.imageUrl || null;

      if (role === "master" && masterFiles.length > 0) {
        const newImages = [];
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
          if (!data.secure_url)
            throw new Error("Помилка завантаження фото");

          newImages.push({
            url: data.secure_url,
            public_id: data.public_id,
          });
        }
        uploadedMasterImages = newImages;
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
        if (!data.secure_url)
          throw new Error("Помилка завантаження фото");

        uploadedManagerUrl = data.secure_url;
      }

      const payload = {
        _id: initialData?._id || null,
        createdBy: role,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        warrantyVerdict: warrantyVerdict || "Гарантія",
        masterImages: uploadedMasterImages,
        rezolution: rezolution || "default",
        master: master || "",
        repairNumber: repairNumber || "",
        certificateNumber: certificateNumber || "",
        brand: brand || "",
        part: part || "",
        reporting: reporting || "",
        manager: manager || "",
        imageUrl: uploadedManagerUrl,
        saleDate: saleDate ? new Date(saleDate) : null,
        masterComment: masterComment || "",
        fixationDate:
          rezolution === "ok" || rezolution === "rejected"
            ? new Date().toISOString()
            : initialData?.fixationDate || null,
      };
      onSubmit(payload);
      toast.success("Дані успішно збережено");
    } catch (err) {
      console.error(err);
      toast.error(err.message || `Помилка збереження, ${err.message}`);
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
          <label>№ ремонту</label>
          <input
            className={styles.formLabel}
            value={repairNumber}
            onChange={(e) => setRepairNumber(e.target.value)}
          />
        </div>

        <div className={styles.formInput}>
          <label>Майстер</label>
          <input
            className={styles.formLabel}
            value={master}
            onChange={(e) => setMaster(e.target.value)}
          />
        </div>

        {role === "master" && (
          <>
            <div className={styles.formInput}>
              <input
                type="file"
                multiple
                accept="image/*"
                id="masterFileInput"
                hidden
                onChange={handleMasterFilesChange}
              />
              <button
                type="button"
                className={styles.customButton}
                onClick={() =>
                  document.getElementById("masterFileInput").click()
                }
              >
                {masterFiles.length > 0
                  ? `Фото: ${masterFiles.length} шт`
                  : "Фото"}
              </button>
            </div>

            <div className={styles.formInput}>
              <select
                className={styles.formLabel}
                value={warrantyVerdict}
                onChange={(e) => setWarrantyVerdict(e.target.value)}
              >
                <option value="">Заключення</option>
                <option value="Гарантія">Гарантія</option>
                <option value="Не гарантія">Не гарантія</option>
              </select>
            </div>

            <div className={styles.formInput}>
              <textarea
                className={styles.formLabelTextarea}
                value={masterComment}
                onChange={(e) => setMasterComment(e.target.value)}
                placeholder="Коментар майстра"
              />
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
              />
            </div>

            <div className={styles.formInput}>
              <label>Менеджер</label>
              <select   
               className={styles.formLabel}
               value = {manager}
              onChange={(e) => setManager(e.target.value)}>
                 <option value = "">Не вказано</option>
             <option value = "Віталік">Віталік</option>
               <option vlaue = "Роман">Роман</option>
                 <option value = "Олег">Олег</option>
                   <option value = "Валентина">Валентина</option>
                     <option value = "Андрій Д.">Андрій Д.</option>
                       <option value = "Андрій Н.">Андрій Н.</option>
              </select>
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
              <label>Додати фото</label>
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
             {managerFile !== null
                  ? `Фото вибрано`
                  : "Обрати"}
              </button>
            </div>

            <div className={styles.formInput}>
              <label>Резолюція</label>
              <select
                className={styles.formLabel}
                value={rezolution}
                onChange={(e) => setRezolution(e.target.value)}
              >
                 <option value="default">Не вказано</option>
                <option value="waiting">На погодженні</option>
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
