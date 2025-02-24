import { usePathname } from "next/navigation";
import styles from "./header.module.css";
import Link from "next/link";
export function Header() {
  const pathname = usePathname();
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.headerList}>
          <li className={pathname === "/nomenclature" ? styles.active : ""}>
            <Link href="/nomenclature">Створення номенклатури</Link>
          </li>
          <li className={pathname === "/reserve" ? styles.active : ""}>
            <Link href="/reserve">Резерв та погодження</Link>
          </li>
          <li className={pathname === "/warranty" ? styles.active : ""}>
            <Link href="/warranty">Гарантійні ремонти</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
