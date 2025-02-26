"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ReserveForm from "../components/reserveForm/reserveForm";
import Loader from "../components/loader/loader";
import styles from "./page.module.css";
import { AnimatePresence, motion } from "framer-motion";
import CommentModal from "../components/Modal/commentModal";

export default function ReserveList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReserveId, setSelectedReserveId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch(
          "https://node-kwitka.onrender.com/api/reserve"
        );
        if (!response.ok) throw new Error("Помилка отримання даних");
        const data = await response.json();
        console.log(data);
        setReservations(data.reservation);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);
  useEffect(() => {
    const newSocket = io("https://node-kwitka.onrender.com");
    setSocket(newSocket);

    newSocket.on("message", (msg) => {
      console.log("Received:", msg);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);
  const sendMessage = () => {
    socket?.emit("message", "Нове сповіщення");
  };
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(
        `https://node-kwitka.onrender.com/api/reserve/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reserveStatus: newStatus }),
        }
      );

      if (!res.ok) {
        throw new Error(`Помилка при оновленні статусу: ${res.statusText}`);
      }

      sendMessage();
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res._id === id ? { ...res, reserveStatus: newStatus } : res
        )
      );
    } catch (error) {
      console.error("Помилка оновлення статусу:", error);
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

  // const handleRequestAudio = () => {
  //   if (socket) {
  //     socket.emit("sendAudio");
  //   }
  // };

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
                  ×
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
