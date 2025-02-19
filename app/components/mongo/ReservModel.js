import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  repairNumber: { type: String, required: true },
  requestDate: { type: Date, default: Date.now },
  initiator: { type: String, required: true },
  approvalStatus: {
    type: String,
    enum: ["Погоджено", "Збірка", "Резерв замовлення", "Уточнення"],
    required: true,
  },
  reserveStatus: {
    type: String,
    enum: ["Повний", "Частковий", "Відсутній", "Помилка"],
  },
  comment: { type: String },
  executor: { type: String, required: true },
});

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
