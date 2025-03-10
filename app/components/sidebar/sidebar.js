"use client";

import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import styles from "./styles.module.css";
import Loader from "../loader/loader";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleClick = (href) => {
    startTransition(() => {
      window.location.href = href;
    });
  };

  return (
    <aside className={styles.navBlock}>
      <nav className={styles.nav}>
        <Link href="/" onClick={() => handleClick("/")}>
          <FaHome />
        </Link>
        <ul className={styles.headerList}>
          <li className={pathname === "/nomenclature" ? styles.active : ""}>
            <Link
              href="/nomenclature"
              onClick={() => handleClick("/nomenclature")}
            >
              Номенклатура
            </Link>
          </li>
          <li className={pathname === "/reserve" ? styles.active : ""}>
            <Link href="/reserve" onClick={() => handleClick("/reserve")}>
              Резерв
            </Link>
          </li>
          <li className={pathname === "/warranty" ? styles.active : ""}>
            <Link href="/warranty" onClick={() => handleClick("/warranty")}>
              Гарантія
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.stats}>
        <p>Звітність</p>
      </div>

      {isPending && <Loader />}
    </aside>
  );
};
