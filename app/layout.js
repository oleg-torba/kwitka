"use client";
import "./globals.css";
import { Header } from "./components/header/header";
import { NotificationProvider } from "./components/notifications/notifications";

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>
        <NotificationProvider>
          <div className="container">
            <Header />
            <main>{children}</main>
            <footer></footer>
          </div>
        </NotificationProvider>
      </body>
    </html>
  );
}
