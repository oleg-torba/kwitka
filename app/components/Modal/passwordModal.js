import styles from "../main/main.module.css";

export const PasswordModal = ({ isOpen, onClose, onSubmit, error }) => {
  return (
    <div>
      {isOpen && (
        <div>
          <h3 className={styles.passTitle}>
            Для видалення чи редагування потрібен пароль
          </h3>
          <form
            className={styles.passForm}
            onSubmit={(e) => {
              e.preventDefault();
              const password = e.target.password.value;
              onSubmit(password);
            }}
          >
            <input
              className={styles.formInput}
              type="password"
              name="password"
              placeholder="Введіть пароль"
            />
            <button className={styles.passBtn} type="submit">
              Ок
            </button>
            {error && <p>{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};
