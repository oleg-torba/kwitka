import "./globals.css";
import { Header } from "./components/header/header";
import { NotificationProvider } from "./components/notifications/notifications";
import NotificationIcon from "./components/icon/icon";

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>
        <NotificationProvider>
          <div className="container">
            <NotificationIcon />
            <Header />
            <main>{children}</main>
            <footer></footer>
          </div>
        </NotificationProvider>
      </body>
    </html>
  );
}
