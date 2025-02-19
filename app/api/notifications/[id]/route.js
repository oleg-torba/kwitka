import dbConnect from "../../../utils/dbConnect";
import Notification from "../../../models/Notification";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const updatedNotification = await Notification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );
      res.status(200).json({ success: true, data: updatedNotification });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      await Notification.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Сповіщення видалено" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Метод не дозволений" });
  }
}
