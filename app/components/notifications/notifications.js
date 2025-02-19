"use client";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [reserves, setReserves] = useState([]);

  useEffect(() => {
    const socket = io(); // Підключаємося до WebSocket сервера

    // Слухаємо події, коли приходить нове сповіщення
    socket.on("receiveNotification", (message) => {
      setNotifications((prev) => [...prev, message]); // Додаємо нове сповіщення до стейту
      const sound = new Audio("/message.mp3"); // Відтворюємо звук
      sound.play();

      // Якщо це повідомлення про новий резерв
      if (message.type === "reserve_created") {
        setReserves((prevReserves) => [...prevReserves, message]);
      }
    });

    return () => {
      socket.disconnect(); // Очищаємо підключення при розмонтажі
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, reserves }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
