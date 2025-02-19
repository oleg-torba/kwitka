"use client";
import { useState } from "react";

export default function CommentModal({
  isOpen,
  onAddComment,
  selectedReserveId,
}) {
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // запобігаємо перезавантаженню сторінки

    if (!newCommentText.trim() || !newCommentAuthor.trim()) {
      alert("Будь ласка, заповніть всі поля!");
      return;
    }

    console.log("Коментар: ", newCommentText);
    console.log("Автор: ", newCommentAuthor);
    onAddComment(selectedReserveId, newCommentAuthor, newCommentText);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Додати коментар</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="author">Автор коментаря:</label>
          <select
            id="author"
            value={newCommentAuthor}
            onChange={(e) => setNewCommentAuthor(e.target.value)}
          >
            <option value="">Виберіть автора</option>
            <option value="Іван Іванов">Іван Іванов</option>
            <option value="Олександр Петров">Олександр Петров</option>
            <option value="Марія Сидорова">Марія Сидорова</option>
          </select>
          <br />
          <label htmlFor="comment">Коментар:</label>
          <textarea
            id="comment"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Додається..." : "Додати"}
          </button>
        </form>
      </div>
    </div>
  );
}
