"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CertificateTable from "../components/table/certificateTable";
import Sidebar from "../components/Sidebar/Sidebar";
import CertificateForm from "../components/form/masterForm";
import Loader from "../components/loader/loader";

const WarrantyPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      setLoading(true);
    const fetchCertificates = async () => {

      try {
        const response = await axios.get(
          "http://localhost:3001/api/warranty"
        );
        setCertificates(response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [certificates.length]);

  const handleAddClick = () => {
    setShowRoleSelect(true);
  };

  const handleRoleSelect = (role) => {
    setUserRole(role);
    console.log("Вибрана роль:", role);
    setShowRoleSelect(false);
    setShowForm(true);
  };
  const handleDeleteCertificate = async (id) => {
    if (!id) {
      console.warn("ID відсутній");
      return;
    }

    const confirmDelete = window.confirm(
      "Ви впевнені, що хочете видалити сертифікат? Дію не можна скасувати."
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:3001/api/warranty/${id}`);

      setCertificates((prev) => prev.filter((cert) => cert._id !== id));

      setSelectedItem(null);
      toast.success("Сертифікат видалено");
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Помилка видалення");
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    if (!data) {
      console.warn("handleFormSubmit викликано без data");
      return;
    }

    try {
      let response;
    setLoading(true);
      if (data._id) {
    
        response = await axios.put(
          `http://localhost:3001/api/warranty/edit/${data._id}`,
          data
        );

        setCertificates((prev) =>
          prev.map((cert) => (cert._id === data._id ? response.data : cert))
        );setLoading(false);
      } else {
      
        response = await axios.post(
          "http://localhost:3001/api/warranty/addWarranty",
          data
        );

        setCertificates((prev) => [...prev, response.data]);
      }
    } catch (err) {
      console.error(err);
   
    } finally {
      setLoading(false);
      setShowForm(false);
    }
  };

  return (
    <>
    {loading && <Loader/>}
      
      {showRoleSelect && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowRoleSelect(false)}
            >
              ✖
            </button>
            <h3>Хто буде оформлювати сертифікат?</h3>
            <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
              <button
                className={styles.roleBtn}
                onClick={() => handleRoleSelect("master")}
              >
                Майстер
              </button>
              <button
                className={styles.roleBtn}
                onClick={() => handleRoleSelect("manager")}
              >
                Менеджер
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && userRole && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeBtn}
              onClick={() => {
                setShowForm(false);
                setUserRole(null);
              }}
            >
              ✖
            </button>

            <CertificateForm
              role={userRole}
              mode={selectedItem ? "edit" : "create"}
              initialData={selectedItem}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
      <div className={styles.mainContainer}>
        <button className={styles.addBtn} onClick={handleAddClick}>
        Додати
      </button>
        <CertificateTable
          data={certificates}
          onRowClick={(item) => setSelectedItem(item)}
        />
        {selectedItem && (
          <div
            className={styles.modalOverlay}
            onClick={() => setSelectedItem(null)}
          >
            <div
              className={styles.sidebarModal}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedItem(null)}
              >
                ✖
              </button>

              <Sidebar
                item={selectedItem}
                isOpen={!!selectedItem}
                onUpdate={handleFormSubmit}
                onClose={() => setSelectedItem(null)}
                onDelete={handleDeleteCertificate}
                onEdit={() => {
                  setUserRole("manager");
                  setShowForm(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WarrantyPage;
