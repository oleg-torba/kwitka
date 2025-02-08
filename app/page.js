import styles from "./page.module.css";

import Header from "./components/main/main";
import Head from "next/head";

export default function Home() {
  return (
    <div className={styles.page}>
      <Head>
        <title>Сервісний центр | Гарантійні сертифікати</title>
        <meta
          name="description"
          content="Перевіряйте гарантійні сертифікати онлайн"
        />
      </Head>
      <main className={styles.main}>
        <Header />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
