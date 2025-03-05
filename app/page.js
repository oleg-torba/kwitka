"use client";
import Link from "next/link";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Home() {
  const [updates, setUpdates] = useState([]);
  const [warranty, setWarranty] = useState([]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const formattedTime = date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://node-kwitka.onrender.com/api/reserve/update"
        );
        const data = await res.json();
        setUpdates(data);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://node-kwitka.onrender.com/api/warranty/update"
        );
        const data = await res.json();
        console.log(data);
        setWarranty(data);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className={styles.main}>
        <h2>Останні записи</h2>
        <div>
          <div className={styles.reserveBlock}>
            <h3>Резерви</h3>
            <ul className={styles.updateBlock}>
              {updates.length > 0 ? (
                updates.map((update) => (
                  <li key={update._id} className={styles.updateList}>
                    <span>{update.repairNumber}</span>
                    <span>{update.approvalStatus}</span>
                    <span className={styles.date}>
                      {formatDate(update.requestDate)}
                    </span>
                  </li>
                ))
              ) : (
                <p>Немає оновлень</p>
              )}
            </ul>
          </div>
          <div>
            <div className={styles.reserveBlock}>
              <h3>Гарантійки</h3>
              <ul className={styles.updateBlock}>
                {warranty.length > 0 ? (
                  warranty.map((data) => (
                    <li key={data._id} className={styles.updateList}>
                      <span>{data.repairNumber}</span>
                      {data.rezolution === "ok" && <span>Погоджено</span>}
                      {data.rezolution === "rejected" && <span>Відхилено</span>}
                      {data.rezolution === "" && <span>На погодженні</span>}
                      <span className={styles.date}>
                        {formatDate(data.createdAt)}
                      </span>
                    </li>
                  ))
                ) : (
                  <p>Немає оновлень</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
