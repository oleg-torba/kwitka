import { dbConnect } from "@/app/components/mongo/lib/mongolib";
import NotificationsModel from "@/app/components/mongo/NotificationsModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const notifications = await NotificationsModel.find().sort({
      createdAt: -1,
    });
    return Response.json({ success: true, data: notifications });
  } catch (error) {
    console.error("Помилка при отриманні сповіщень:", error);
    return Response.json(
      { success: false, error: "Не вдалося отримати сповіщення" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();
  const { message } = await req.json();

  const newNotification = new NotificationsModel({
    message,
    createdAt: new Date(),
  });

  try {
    await newNotification.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Помилка при збереженні сповіщення:", error);
    return NextResponse.json({
      success: false,
      error: "Помилка при збереженні",
    });
  }
}

export async function PUT(req) {
  try {
    const { id } = await req.json();
    await dbConnect();
    const updatedNotification = await NotificationsModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updatedNotification) {
      return Response.json(
        { success: false, error: "Сповіщення не знайдено" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: updatedNotification });
  } catch (error) {
    console.error("Помилка при оновленні сповіщення:", error);
    return Response.json(
      { success: false, error: "Не вдалося оновити сповіщення" },
      { status: 500 }
    );
  }
}
