import { useState, useEffect } from "react";

export default function CommentModal({
  isOpen,
  onAddComment,
  selectedReserveId,
}) {
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  // Ініціалізація, якщо є попередній коментар у резервуванні
  useEffect(() => {
    if (selectedReserveId?.comment) {
      const [author, text] = selectedReserveId.comment.split(":");
      setNewCommentAuthor(author || "");
      setNewCommentText(text || "");
    }
  }, [selectedReserveId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newCommentText.trim() || !newCommentAuthor.trim()) {
      alert("Будь ласка, заповніть всі поля!");
      return;
    }

    onAddComment(selectedReserveId._id, newCommentAuthor, newCommentText);
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
            <option value="Назар">Назар</option>
            <option value="Дмитро">Дмитро</option>
            <option value="Денис">Денис</option>
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
