"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ReserveForm from "../components/reserveForm/reserveForm";
import Loader from "../components/loader/loader";
import styles from "./page.module.css";
import { AnimatePresence, motion } from "framer-motion";
import CommentModal from "../components/Modal/commentModal";

let socket;

export default function ReserveList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newComments, setNewComments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedReserveId, setSelectedReserveId] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [apiError, setApiError] = useState(null);

  const playNotificationSound = () => {
    const audio = new Audio("/message.mp3");
    audio.play();
  };

  // Підключення до WebSocket сервера
  useEffect(() => {
    socket = io(); // Підключення до сервера WebSocket

    socket.on("connect", () => {
      console.log("Підключено до WebSocket сервера");
    });

    socket.on("receiveNotification", (notification) => {
      console.log("📩 Отримано сповіщення:", notification);
      if (notification && notification.message) {
        setNewComments((prevComments) => ({
          ...prevComments,
          [notification.id]: notification.message,
        }));
        playNotificationSound(); // Відтворюємо звук після отримання повідомлення
      }
    });

    return () => {
      socket.disconnect(); // Відключення при демонтажі компонента
    };
  }, []);

  // Отримуємо список резервувань
  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch("/api/reserve");
        if (!response.ok) throw new Error("Помилка отримання даних");
        const data = await response.json();
        setReservations(data.data);
        if (response.ok) {
          // Надсилаємо повідомлення всім підключеним клієнтам через WebSocket
          await fetch("/socket.io", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `Новий резерв створено: `,
              type: "reserve_created",
            }),
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/reserve/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reserveStatus: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        await addNotification(`Статус резерву ${id} оновлено на ${newStatus}`);
        socket.emit("sendNotification", `Статус резерву ${id} оновлено`);
      }
    } catch (error) {
      console.error("Помилка оновлення статусу:", error);
    }
  };

  const handleAddComment = async (id, author, commentText) => {
    const reserve = reservations.find((res) => res._id === selectedReserveId);
    const updatedComment =
      reserve.comment && reserve.comment.trim()
        ? `${reserve.comment}\n${newCommentAuthor}: ${newCommentText}`
        : `${newCommentAuthor}: ${newCommentText}`;

    try {
      const response = await fetch(`/api/reserve/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: updatedComment }),
      });

      const data = await response.json();

      if (data.success) {
        setReservations((prevReservations) =>
          prevReservations.map((res) =>
            res._id === id ? { ...res, comment: updatedComment } : res
          )
        );
        handleCloseModal();

        // Додаємо сповіщення в базу
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: `Коментар додано до резерву ${id}` }),
        });

        socket.emit("sendNotification", `Коментар додано до резерву ${id}`);
      } else {
        setApiError("Не вдалося додати коментар!");
      }
    } catch (error) {
      console.error("Помилка при додаванні коментаря:", error);
      setApiError("Сталася помилка!");
    }
  };

  const openModal = (id) => {
    setSelectedReserveId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewCommentText("");
    setNewCommentAuthor("");
  };

  if (loading) return <Loader />;
  if (error) return <p>Помилка: {error}</p>;

  return (
    <div>
      <h2>Список резервувань</h2>

      <div>
        <button onClick={() => setShowForm(true)}>Створити резерв</button>

        {showForm && (
          <div>
            <ReserveForm onClose={() => setShowForm(false)} />
          </div>
        )}
      </div>
      {apiError && <p style={{ color: "red" }}>{apiError}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Номер ремонту</th>
            <th>Дата запиту</th>
            <th>Ініціатор</th>
            <th>Тип запиту</th>
            <th>Статус резерву</th>
            <th>Коментар</th>
            <th>Виконавець</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map((res) => (
              <tr key={res._id}>
                <td>{res.repairNumber}</td>
                <td>{new Date(res.requestDate).toLocaleDateString()}</td>
                <td>{res.initiator}</td>
                <td>{res.approvalStatus}</td>
                <td>
                  <select
                    value={res.reserveStatus}
                    onChange={(e) =>
                      handleStatusChange(res._id, e.target.value)
                    }
                  >
                    <option value="Повний">Повний резерв</option>
                    <option value="Частковий">Частковий резерв</option>
                    <option value="Відсутній">Відсутній</option>
                    <option value="Помилка">Помилка</option>
                  </select>
                </td>
                <td>
                  {res.comment && res.comment.length > 0 ? (
                    res.comment
                      .split("\n")
                      .map((comment, index) => <div key={index}>{comment}</div>)
                  ) : (
                    <div>Немає коментарів</div>
                  )}
                  <button onClick={() => openModal(res._id)}>
                    Додати коментар
                  </button>
                </td>
                <td>{res.executor}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Немає резервувань</td>
            </tr>
          )}
        </tbody>
      </table>
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <span
                  className={styles.close}
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </span>
                <CommentModal
                  isOpen={showModal}
                  selectedReserveId={selectedReserveId}
                  onAddComment={handleAddComment}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
