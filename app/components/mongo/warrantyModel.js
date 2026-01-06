// import { Schema, model, models } from "mongoose";

// const WarrantySchema = new Schema({
//   repairNumber: { type: String, required: true },
//   createdBy: { type: String, enum: ["master", "manager"], required: true },
//   createdAt: { type: Date, default: Date.now },

//   // --- MASTER ---
//   warrantyVerdict: { type: String, enum: ["Гарантія","Не гарантія"], default: null },
//   masterImages: [
//     {
//       url: String,
//       public_id: String,
//     }
//   ],

//   // --- MANAGER ---
//   certificateNumber: { type: String, default: null },
//   part: { type: String, default: null },
//   brand: { type: String, default: null },
//   saleDate: { type: Date, default: null },
//   reporting: { type: String, default: null },
//   manager: { type: String, default: null },
//   imageUrl: { type: String, default: null }, // залишаємо одне фото для менеджера

//   // --- STATUS ---
//   rezolution: { type: String, enum: ["","ok","rejected"], default: "" },
//   fixationDate: { type: Date, default: null },
// });

// const Warranty = models.warranty || model("warranty", WarrantySchema);
// export default Warranty;
