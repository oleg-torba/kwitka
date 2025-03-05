import { usePathname } from "next/navigation";
import styles from "./styles.module.css";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className={styles.navBlock}>
      <nav className={styles.nav}>
        <Link href="/">
          <FaHome />
        </Link>
        <ul className={styles.headerList}>
          <li className={pathname === "/nomenclature" ? styles.active : ""}>
            <Link href="/">Номенклатура</Link>
          </li>
          <li className={pathname === "/reserve" ? styles.active : ""}>
            <Link href="/reserve">Резерв</Link>
          </li>
          <li className={pathname === "/warranty" ? styles.active : ""}>
            <Link href="/warranty">Гарантія</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.stats}>
        <p>Звітність</p>
      </div>
    </aside>
  );
};
