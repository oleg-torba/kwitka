"use client"; 
import { FaUserClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import styles from "./sidebar.module.css";
import CertificateForm from "../form/masterForm";
import { useState } from "react";
const Sidebar = ({ item, isOpen, onClose, onUpdate, onDelete }) => {
    const [showEditForm, setShowEditForm] = useState(false);

  if (!isOpen) return null;
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    return date.toLocaleDateString("uk-UA");
  };
  
  return (
    <div className={styles.sidebar}>
      <h2>Заявка № {item.repairNumber} на гарантію</h2>
      <div
        style={{
          padding: "8pч",
          display: "flex",
          alignItems: "center",
          borderRadius: "6px",
          margin: "20px 0",

          backgroundColor:
            item.rezolution === "ok"
              ? "rgba(76, 175, 80, 0.08)"
              : item.rezolution === "rejected"
              ? "rgba(255, 152, 0, 0.10)"
              : "rgba(33, 150, 243, 0.08)",
        }}
      >
        {item.rezolution === "ok" && (
          <FaCheckCircle
            size={24}
            style={{ fill: "#2E7D32", marginLeft: "20px" }}
          />
        )}
        {item.rezolution === "rejected" && (
          <FaTimesCircle
            size={24}
            style={{ fill: "#EF6C00", marginLeft: "20px" }}
          />
        )}
        {item.rezolution === "" && (
          <FaUserClock
            size={24}
            style={{ fill: "#1565C0", marginLeft: "20px" }}
          />
        )}
        <span className={styles.sidebarContent}>
          {item.rezolution === "ok"
            ? "Погоджено"
            : item.rezolution === "rejected"
            ? "Відхилено"
            : "На погодженні"}
        </span>
      </div>
      <ul className={styles.sidebarContentBlock}>
        <li>
          <p>Дата створення</p>
          <span>{formatDate(item.createdAt)}</span>
        </li>
        <li>
          <p>Талон</p>
          <span>{item.certificateNumber}</span>
        </li>
        <li>
          <p>Продаж </p>
          <span>{formatDate(item.saleDate)}</span>
        </li>
        <li>
          <p>Клієнт</p>
          <span>{item.reporting}</span>
        </li>
        <li>
          <p>Менеджер </p>
          <span>{item.manager}</span>
        </li>
        <li>
          <p>Майстер </p>
          <span>{item.master}</span>
        </li>
         <li>
          <p>Коментар майстра </p>
          <span>{item.masterComment}</span>
        </li>
      </ul>
      <div className={styles.sidebarBlock}>
        Рішення майстра: {item.warrantyVerdict || "не вказано"}
    
       <div className={styles.imageBox}>
  {item.masterImages && item.masterImages.length > 0 ? (
    item.masterImages.map((img, idx) => (
      <a
        key={idx}
        href={img.url}
        target="_blank"
        rel="noopener noreferrer"
      >
       Майстра фото
      </a>
    ))
  ) : (
    <p>Фото майстра відсутнє</p>
  )}
  {item?.imageUrl && (
<a href={item.imageUrl} target="_blank" rel="noopener noreferrer">Менеджера фото</a>
)}
</div>

      </div>
{showEditForm && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <button
        className={styles.closeBtn}
        onClick={() => setShowEditForm(false)}
      >
        ✖
      </button>

      <CertificateForm
        role="manager"
        mode="edit"
        initialData={item}         
        onSubmit={(updatedData) => {
          onUpdate(updatedData); 
          setShowEditForm(false);
        }}
      />
    </div>
  </div>
)}

      <div>
        <a
          className={styles.pdfBtn}
          href={item.imageUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          PDF
        </a>
        <button     onClick={() => setShowEditForm(true)}
 className={styles.Btn}>Редагувати</button>
        <select
          className={styles.selectBtn}
          name="rezolution"
          value={item.rezolution || ""}
          onChange={(e) => onResolutionChange(item._id, e.target.value)}
        >
          {" "}
          <option value="">На погодженні</option>{" "}
          <option value="ok">Погоджено</option>{" "}
          <option value="rejected">Відхилено</option>{" "}
        </select>{" "}
        <button className={styles.archiveBtn} onClick={() => onDelete(item._id)}>Архівувати</button>
      </div>
    </div>
  );
};
export default Sidebar;