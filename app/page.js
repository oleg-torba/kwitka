
import styles from "./styles.module.css";
import WarrantyPage from "./warranty/page";

export default function Home() {
  return (
    <>
      <div className={styles.main}>
        <WarrantyPage />
      </div>
    </>
  );
}
