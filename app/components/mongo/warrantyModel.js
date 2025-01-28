import { Schema, model, models } from "mongoose";

const WarrantySchema = new Schema({
  repairNumber: {
    type: String,
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
  },
  part: {
    type: String,
    required: true,
  },
  saleDate: {
    type: Date,
    required: true,
  },
  reporting: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  manager: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  brand: {
    type: String,
    required: true,
  },
  rezolution: {
    type: String,
    default: "",
  },
});

const Warranty = models.warranty || model("warranty", WarrantySchema);

export default Warranty;
