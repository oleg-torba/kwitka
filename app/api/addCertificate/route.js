import { NextResponse } from "next/server";
import { dbConnect } from "@/app/components/mongo/lib/mongolib";
import Warranty from "@/app/components/mongo/warrantyModel";

export async function POST(req) {
  try {
    await dbConnect();
    console.log("База даних підключена");

    const body = await req.json();

    const {
      repairNumber,
      certificateNumber,
      part,
      saleDate,
      reporting,
      manager,
      brand,
      imageUrl,
    } = body;

    if (
      !repairNumber ||
      !certificateNumber ||
      !part ||
      !saleDate ||
      !reporting ||
      !manager ||
      !brand ||
      !imageUrl
    ) {
      return NextResponse.json(
        { error: "Усі обов'язкові поля мають бути заповнені." },
        { status: 400 }
      );
    }

    const existingWarranty = await Warranty.findOne({ certificateNumber });
    if (existingWarranty) {
      return NextResponse.json(
        { error: "Сертифікат із таким номером вже існує." },
        { status: 400 }
      );
    }

    const newWarranty = await Warranty.create({
      repairNumber,
      certificateNumber,
      part,
      saleDate,
      reporting,
      manager,
      brand,
      imageUrl,
    });

    return NextResponse.json(
      {
        message: "Гарантійний сертифікат успішно створено.",
        data: newWarranty,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Помилка при створенні сертифіката:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { error: "Помилка при створенні сертифіката." },
      { status: 500 }
    );
  }
}
