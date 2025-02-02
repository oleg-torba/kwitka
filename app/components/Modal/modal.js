import { useState } from "react";
import { PasswordModal } from "./PasswordModal";
import axios from "axios";
import toast from "react-toastify";
import UploadCertificate from "./UploadCertificate"; // Це може бути компонент форми для редагування сертифікату

export const CertificateEdit = ({ certificateId }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  const handlePasswordSubmit = (password) => {
    if (password === "1122") {
      fetchCertificateData();
      setShowPasswordForm(false);
    } else {
      toast.error("Невірний пароль!");
    }
  };

  const fetchCertificateData = async () => {
    try {
      const response = await axios.get(`/api/warranty/${certificateId}`);
      setCertificateData(response.data);
    } catch (err) {
      toast.error("Не вдалося завантажити сертифікат.");
    }
  };

  return (
    <div>
      <button onClick={() => setShowPasswordForm(true)}>
        Редагувати сертифікат
      </button>

      <PasswordModal
        isOpen={showPasswordForm}
        onClose={() => setShowPasswordForm(false)}
        onSubmit={handlePasswordSubmit}
      />

      {certificateData && (
        <UploadCertificate
          certificate={certificateData}
          onSubmit={(updatedData) => console.log(updatedData)}
        />
      )}
    </div>
  );
};
