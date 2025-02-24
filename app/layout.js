"use client";
import "./globals.css";
import { Header } from "./components/header/header";

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>
        <div className="container">
          <Header />
          <main>{children}</main>
          <footer></footer>
        </div>
      </body>
    </html>
  );
}
