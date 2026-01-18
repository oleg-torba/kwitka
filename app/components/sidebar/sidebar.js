"use client";
import { FaUserClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import styles from "./Sidebar.module.css";

const Sidebar = ({ item, isOpen, onClose, onUpdate, onDelete, onEdit }) => {
  if (!isOpen || !item) return null;
  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return date.toLocaleDateString("uk-UA");
  };

  return (
    <div className={styles.sidebar}>
      <h2>Заявка № {item.repairNumber} на гарантію</h2>
      
      <div
        style={{
          padding: "5px",
          display: "flex",
          alignItems: "center",
          borderRadius: "6px",
          margin: "5px 0",
          fontSize: "14px",
          backgroundColor:
            item.rezolution === "ok"
              ? "rgba(76, 175, 80, 0.08)"
              : item.rezolution === "rejected"
              ? "rgba(255, 152, 0, 0.10)"
              : "rgba(33, 150, 243, 0.08)",
        }}
      >
        {item.rezolution === "ok" && <FaCheckCircle size={24} style={{ fill: "#2E7D32", marginLeft: "20px" }} />}
        {item.rezolution === "rejected" && <FaTimesCircle size={24} style={{ fill: "#EF6C00", marginLeft: "20px" }} />}
        {item.rezolution === "default" && <FaUserClock size={24} style={{ fill: "#1565C0", marginLeft: "20px" }} />}
        
        <span className={styles.sidebarContent}>
          {item.rezolution === "ok" ? "Погоджено" : item.rezolution === "rejected" ? "Відхилено" : "Не вказано"}
        </span>
      </div>

      <ul className={styles.sidebarContentBlock}>
        <li><p>Дата створення</p><span>{formatDate(item.createdAt)}</span></li>
        <li><p>Талон</p><span>{item.certificateNumber || "Не вказано"}</span></li>
         <li><p>Автор</p><span>{item.createdBy || "Не вказано"}</span></li>
        <li><p>Продаж</p><span>{formatDate(item.saleDate) || "Не вказано"}</span></li>
        <li><p>Клієнт</p><span>{item.reporting || "Не вказано"}</span></li>
        <li><p>Менеджер</p><span>{item.manager || "Не вказано"}</span></li>
        <li><p>Майстер</p><span>{item.master || "Не вказано"}</span></li>
        <li><p>Коментар майстра</p><span>{item.masterComment || "Не вказано"}</span></li>
        <li><p>Рішення:</p> <span>{item.warrantyVerdict || "не вказано"}</span></li>
        <li><p>Дата затвердження:</p> <span>{formatDate(item.fixationDate )|| "не вказано"}</span></li>
        <li>
          {item.masterImages && item.masterImages.length > 0 ? (
            item.masterImages.map((img, idx) => (
              <a key={idx} href={img.url} target="_blank" rel="noopener noreferrer">Фото майстра {idx + 1}</a>
            ))
          ) : <p>Фото майстра: відсутнє</p>}
          {item?.imageUrl && <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">Фото менеджера</a>}
        </li>
      </ul>

      <div className={styles.actions}>
        <a className={styles.pdfBtn} href={item.imageUrl} target="_blank" rel="noopener noreferrer">Завантажити PDF</a>
        <button onClick={onEdit} className={styles.Btn}>Редагувати</button>


        <button className={styles.archiveBtn} onClick={() => onDelete(item._id)}>Архівувати</button>
      </div>
    </div>
  );
};

export default Sidebar;