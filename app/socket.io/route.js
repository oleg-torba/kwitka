import { NextResponse } from "next/server";
import { Server } from "socket.io";

let io; // Оголошуємо змінну для зберігання серверу сокетів

// Функція для ініціалізації WebSocket сервера
const initSocketServer = (server) => {
  if (!io) {
    console.log("🔌 Створюємо новий Socket.IO сервер...");
    io = new Server(server, {
      cors: { origin: "*" }, // Дозволяємо підключення з будь-якого джерела
    });

    io.on("connection", (socket) => {
      console.log("✅ Користувач підключився:", socket.id);

      // Обробка події на відправку нового сповіщення
      socket.on("sendNotification", (notification) => {
        console.log("📩 Нове сповіщення:", notification);
        io.emit("receiveNotification", notification); // Випромінюємо сповіщення всім клієнтам
      });

      socket.on("disconnect", () => {
        console.log("❌ Користувач відключився:", socket.id);
      });
    });
  }
};

// API маршрут для обробки WebSocket підключень
const ioHandler = (req) => {
  const { method } = req;

  if (method === "POST") {
    const { message } = req.body; // Отримуємо повідомлення з тіла запиту

    // Повідомляємо всіх клієнтів через WebSocket
    if (message) {
      io.emit("receiveNotification", { message }); // Випромінюємо сповіщення
    }

    return NextResponse.json({ message: "Notification sent to all clients" });
  }

  // Якщо запит GET, просто повідомляємо, що сервер працює
  if (method === "GET") {
    return NextResponse.json({ message: "Socket.IO server is running" });
  }
};

export const GET = ioHandler;
export const POST = ioHandler;
