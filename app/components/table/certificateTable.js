import React from "react";
import { CgArrowDownR } from "react-icons/cg";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { FiClock } from "react-icons/fi";
import styles from "../../warranty/page.module.css";

const CertificateTable = ({
  data,
  onEdit,
  onDelete,
  onDownload,
  onResolutionChange,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = (rezolution, autoApproved) => {
    if (rezolution === "ok") {
      return (
        <span className={styles.checkIcon}>
          <FaCheck size={15} />
          {autoApproved && <p>Автоматично</p>}
        </span>
      );
    }
    if (rezolution === "rejected") {
      return <MdClose size={15} color="red" title="Відхилено" />;
    }
    return <FiClock size={15} color="gray" title="На погодженні" />;
  };

  return (
    <table className={styles.certificateTable}>
      <thead>
        <tr className={styles.tableTitle}>
          <th>№ ремонту</th>
          <th>Дата заповнення</th>
          <th>Бренд</th>
          <th>Талон</th>
          <th>Запчастина</th>
          <th>Дата продажу</th>
          <th>Дані клієнта</th>
          <th>Менеджер</th>
          <th className={styles.action}>Дії</th>
          <th>Затвердження</th>
        </tr>
      </thead>
      <tbody>
        {data.map((cert) => (
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
                  onClick={() => onDownload(cert.imageUrl)}
                >
                  <CgArrowDownR size={15} title="Завантажити PDF" />
                </span>
                <span className={styles.icon} onClick={() => onEdit(cert._id)}>
                  <FiEdit size={15} title="Редагувати" />
                </span>
                <span
                  className={styles.icon}
                  onClick={() => onDelete(cert._id)}
                >
                  <FiTrash size={15} title="Видалити" />
                </span>
              </div>
            </td>
            <td>
              <div className={styles.statusIcon}>
                <div>
                  <select
                    className={styles.rezolution}
                    name="rezolution"
                    value={cert.rezolution || ""}
                    onChange={(e) =>
                      onResolutionChange(cert._id, e.target.value)
                    }
                  >
                    <option value="">На погодженні</option>
                    <option value="ok">Погоджено</option>
                    <option value="rejected">Відхилено</option>
                  </select>
                </div>
                {cert.rezolution !== "" && (
                  <p>
                    {new Date(cert.fixationDate).toLocaleDateString("uk-UA")}
                  </p>
                )}
                <div>{getStatusIcon(cert.rezolution, cert.autoApproved)}</div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CertificateTable;
