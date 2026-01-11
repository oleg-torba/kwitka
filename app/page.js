
import styles from "./styles.module.css";
import WarrantyPage from "./warranty/page";
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}
export default function Home() {
  return (
    <>
      <div className={styles.main}>
        <WarrantyPage />
      </div>
    </>
  );
}
