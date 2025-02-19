import { NextResponse } from "next/server";
import { dbConnect } from "@/app/components/mongo/lib/mongolib";
import ReservModel from "@/app/components/mongo/ReservModel";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const newReservation = new ReservModel({
      repairNumber: body.repairNumber,
      requestDate: new Date(),
      initiator: body.initiator,
      approvalStatus: body.approvalStatus,
      reserveStatus: body.reserveStatus,
      comment: body.comment,
      executor: body.executor,
    });

    await newReservation.save();

    return NextResponse.json(
      {
        success: true,
        message: "Резерв успішно створено",
        data: newReservation,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Помилка при створенні резерву",
        error: error.message,
      },
      { status: 400 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const reservations = await ReservModel.find({}).sort({ requestDate: -1 });

    return NextResponse.json(
      { success: true, data: reservations },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Помилка при отриманні резервів",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
