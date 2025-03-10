"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./globals.css";

import { Sidebar } from "./components/sidebar/sidebar";

const socket = io("https://node-kwitka.onrender.com");

export default function RootLayout({ children }) {
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    socket.on("playSound", async ({ sound }) => {
      console.log("Playing sound:", sound);
      await playAudio(`/${sound}`);
    });

    return () => {
      socket.off("playSound");
    };
  }, []);

  const playAudio = async (url) => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(
        arrayBuffer
      );
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } catch (error) {
      console.error("Audio play error:", error);
    }
  };

  return (
    <html lang="uk">
      <body>
        <div className="container">
          <Sidebar />
          <main>{children}</main>
          <footer></footer>
        </div>
      </body>
    </html>
  );
}

export { socket };
