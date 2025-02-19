"use client";
import { useState } from "react";
import { useNotifications } from "../notifications/notifications"; // Імпортуємо контекст для повідомлень

export default function ReserveForm({ onClose }) {
  const { addNotification } = useNotifications();
  const [repairNumber, setRepairNumber] = useState("");
  const [initiator, setInitiator] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [executor, setExecutor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReservation = {
      repairNumber,
      initiator,
      approvalStatus,
      executor,
    };

    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReservation),
      });

      const data = await res.json();
      if (data.success) {
        onClose();
      } else {
        alert("Помилка при створенні резерву!");
      }
    } catch (error) {
      alert("Помилка серверу!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="repairNumber">Номер ремонту</label>
        <input
          type="text"
          id="repairNumber"
          value={repairNumber}
          onChange={(e) => setRepairNumber(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="initiator">Ініціатор</label>
        <input
          type="text"
          id="initiator"
          value={initiator}
          onChange={(e) => setInitiator(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="approvalStatus">Тип запиту</label>
        <select
          id="approvalStatus"
          value={approvalStatus}
          onChange={(e) => setApprovalStatus(e.target.value)}
          required
        >
          <option value="">-----</option>
          <option value="погоджено">Погоджено</option>
          <option value="Збірка">Збірка</option>
          <option value="Резерв замовлення">Резерв замовлення</option>
          <option value="Уточнення">Уточнення</option>
        </select>
      </div>

      <div>
        <label htmlFor="executor">Виконавець</label>
        <select
          id="executor"
          value={executor}
          onChange={(e) => setExecutor(e.target.value)}
          required
        >
          <option value="">-----</option>
          <option value="Назар">Назар</option>
          <option value="Дмитро">Дмитро</option>
        </select>
      </div>

      <div>
        <button type="button" onClick={onClose}>
          Закрити
        </button>
        <button type="submit">Створити резерв</button>
      </div>
    </form>
  );
}
