"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";
import "./globals.css";
import { Header } from "./components/header/header";

const socket = io("https://node-kwitka.onrender.com"); // Заміни на свою адресу сервера

export default function RootLayout({ children }) {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("message", (msg) => {
      console.log("New message:", msg);
    });

    socket.on("playSound", ({ sound }) => {
      console.log("Playing sound:", sound);
      const audio = new Audio(`/${sound}`);
      audio.play();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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

export { socket };
