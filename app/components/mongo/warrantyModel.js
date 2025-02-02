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
  fixationDate: {
    type: Date,
    default: null,
  },
  rezolution: {
    type: String,
    default: "",
  },
  public_id: String,
});

const Warranty = models.warranty || model("warranty", WarrantySchema);

export default Warranty;
