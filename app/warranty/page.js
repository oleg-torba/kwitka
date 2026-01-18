"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosClose } from "react-icons/io";
import styles from "./page.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CertificateTable from "../components/table/certificateTable";
import Sidebar from "../components/sidebar/sidebar";
import CertificateForm from "../components/form/masterForm";
import Loader from "../components/loader/loader";

const WarrantyPage = () => {
  const [search, setSearch] = useState("")
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3001/api/warranty"
        );
        setCertificates(
          response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [certificates.length]);

  const handleAddClick = () => {
    setSelectedItem(null);
    setShowRoleSelect(true);
  };
  const handleRoleSelect = (role) => {
    setUserRole(role);
    setShowRoleSelect(false);
    setShowForm(true);
  };

const filteredCertificates = certificates.filter((item) => {
  const query = search.toLowerCase();

  return (
    item.repairNumber?.toLowerCase().includes(query) ||
    item.manager?.toLowerCase().includes(query) ||
    item.brand?.toLowerCase().includes(query) ||
    item.certificateNumber?.toLowerCase().includes(query) ||
    item.part?.toLowerCase().includes(query) ||
    item.masterComment?.toLowerCase().includes(query) ||
     item.master?.toLowerCase().includes(query) ||
    item.reporting?.toLowerCase().includes(query) ||
    (item.rezolution === "ok" && "погоджено".includes(query)) ||
    (item.rezolution === "rejected" && "відхилено".includes(query)) ||
    (item.rezolution === "" && "на погодженні".includes(query))
  );
});


  const handleDeleteCertificate = async (id) => {
    if (!id) return;
    const confirmDelete = window.confirm("Ви впевнені, що хочете видалити?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(`https://node-kwitka.onrender.com/api/warranty/${id}`);
      setCertificates((prev) => prev.filter((cert) => cert._id !== id));
      setSelectedItem(null);
      setShowSidebar(false);
      toast.success("Видалено");
    } catch (err) {
      toast.error("Помилка видалення");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    if (!data) return;
    try {
      setLoading(true);
      let response;
      if (data._id) {
        response = await axios.put(
          `http://localhost:3001/api/warranty/edit/${data._id}`,
          data
        );
        setCertificates((prev) =>
          prev.map((cert) => (cert._id === data._id ? response.data : cert))
        );
      } else {
        response = await axios.post(
          "http://localhost:3001/api/warranty/addWarranty",
          data
        );
        setCertificates((prev) => [response.data, ...prev]);
      }
      setShowForm(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <ToastContainer />

      {showRoleSelect && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setShowRoleSelect(false)}>✖</button>
            <h3>Хто буде оформлювати?</h3>
            <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
              <button className={styles.roleBtn} onClick={() => handleRoleSelect("master")}>Майстер</button>
              <button className={styles.roleBtn} onClick={() => handleRoleSelect("manager")}>Менеджер</button>
            </div>
          </div>
        </div>
      )}
      {showForm && userRole && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <IoIosClose
              className={styles.closeBtn}
              size={40}
              onClick={() => {
                setShowForm(false);
                setUserRole(null);
                setSelectedItem(null);
              }}
            />
            <CertificateForm
              role={userRole}
              mode={selectedItem ? "edit" : "create"}
              initialData={selectedItem}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
   <div className={styles.head}>
         <button className={styles.addBtn} onClick={handleAddClick}>Додати</button>
        <input
        className={styles.searchInput}
        value={search}
  onChange={(e) => setSearch(e.target.value)}
        type="input"
        placeholder="Пошук">
        </input>
       </div>
      <div className={styles.mainContainer}>
    
        <CertificateTable
          data={filteredCertificates}
          onRowClick={(item) => {
            setSelectedItem(item);
            setShowSidebar(true);
          }}
        />

        {showSidebar && selectedItem && (
          <div className={styles.modalOverlay} onClick={() => setShowSidebar(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <IoIosClose
                size={40}
                className={styles.closeBtn}
                onClick={() => {setShowSidebar(false); setSelectedItem(null);}}
              />
              <Sidebar
                item={selectedItem}
                isOpen={showSidebar}
                onUpdate={handleFormSubmit}
                onDelete={handleDeleteCertificate}
                onClose={() => {setShowSidebar(false); setSelectedItem(null);}}
                onEdit={() => {
                  setUserRole("manager");
                  setShowSidebar(false); 
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