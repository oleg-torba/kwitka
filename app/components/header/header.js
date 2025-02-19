import styles from "./header.module.css";
import Link from "next/link";
export function Header() {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.headerList}>
          <li>
            <Link href="/nomenclature">Створення номенклатури</Link>
          </li>
          <li>
            <Link href="/reserve">Резерв та погодження</Link>
          </li>
          <li>
            <Link href="/warranty">Гарантійні ремонти</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
