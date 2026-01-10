"use client";

import "./globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body className={roboto.className}>
        <div className="container">
          <main>{children}</main>
          <footer></footer>
        </div>
      </body>
    </html>
  );
}
