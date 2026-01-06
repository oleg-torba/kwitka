// import { useState, useEffect } from "react";

// export default function CommentModal({
//   isOpen,
//   onAddComment,
//   selectedReserveId,
// }) {
//   const [newCommentText, setNewCommentText] = useState([]);
//   const [newCommentAuthor, setNewCommentAuthor] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(newCommentAuthor, newCommentText);
//     if (!newCommentText.trim() || !newCommentAuthor.trim()) {
//       alert("Будь ласка, заповніть всі поля!");
//       return;
//     }

//     onAddComment(selectedReserveId, newCommentAuthor, newCommentText);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h3>Додати коментар</h3>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="author">Автор коментаря:</label>
//           <select
//             id="author"
//             onChange={(e) => setNewCommentAuthor(e.target.value)}
//           >
//             <option value="">Виберіть автора</option>
//             <option value="Назар">Назар</option>
//             <option value="Дмитро">Дмитро</option>
//             <option value="Денис">Денис</option>
//           </select>
//           <br />
//           <label htmlFor="comment">Коментар:</label>
//           <textarea
//             id="comment"
//             onChange={(e) => setNewCommentText(e.target.value)}
//           />
//           <button type="submit" disabled={loading}>
//             {loading ? "Додається..." : "Додати"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
