import { useState } from "react";
import styles from "./PasswordModal.module.css";
const PasswordModal = ({ onConfirm }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(password);
    setPassword("");
  };

  return (
    <div>
      <h3 className={styles.title}>
        Редагування та видалення заборонено адміністратором
      </h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        <button className={styles.submitBtn} type="submit">
          Підтвердити
        </button>
      </form>
    </div>
  );
};
export default PasswordModal;
