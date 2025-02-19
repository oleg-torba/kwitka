"use client";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [reserves, setReserves] = useState([]);

  useEffect(() => {
    const socket = io("https://kwitka.onrender.com");

    socket.on("receiveNotification", (message) => {
      setNotifications((prev) => [...prev, message]);
      const sound = new Audio("/message.mp3");
      sound.play();

      if (message.type === "reserve_created") {
        setReserves((prevReserves) => [...prevReserves, message]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, reserves }}>
      {children}
    </NotificationContext.Provider>
  );
};
