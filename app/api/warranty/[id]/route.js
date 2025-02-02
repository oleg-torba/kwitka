import { dbConnect } from "@/app/components/mongo/lib/mongolib";
import Warranty from "@/app/components/mongo/warrantyModel";
import { NextResponse } from "next/server";
import { toast } from "react-toastify";
const crypto = require("crypto");

export async function PUT(req, { params }) {
  const { id } = await params;

  try {
    await dbConnect();
    const updatedData = await req.json();
    const updatedWarranty = await Warranty.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedWarranty) {
      return new Response(
        JSON.stringify({ message: "Сертифікат не знайдено" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(updatedWarranty), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Помилка сервера" }), {
      status: 500,
    });
  }
}

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    await dbConnect();

    const warranty = await Warranty.findById(id);

    if (!warranty) {
      return new Response(
        JSON.stringify({ message: "Сертифікат не знайдено" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(warranty), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Помилка сервера" }), {
      status: 500,
    });
  }
}
export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    await dbConnect();

    const warranty = await Warranty.findById(id);

    if (!warranty) {
      return new Response(
        JSON.stringify({ message: "Сертифікат не знайдено" }),
        { status: 404 }
      );
    }

    const publicId = warranty.public_id;
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = crypto
      .createHash("sha1")
      .update(
        `public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
      )
      .digest("hex");

    const body = new URLSearchParams({
      public_id: publicId,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      signature: signature,
      timestamp: timestamp,
    });

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/destroy`,
      {
        method: "POST",
        body: body,
      }
    );

    const cloudinaryData = await cloudinaryResponse.json();

    if (cloudinaryData.result !== "ok") {
      return new Response(
        JSON.stringify({
          message: "Не вдалося видалити файл з Cloudinary",
          error: cloudinaryData,
        }),
        { status: 500 }
      );
    }

    const deletedWarranty = await Warranty.findByIdAndDelete(id);

    if (!deletedWarranty) {
      return new Response(
        JSON.stringify({ message: "Сертифікат не знайдено" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Сертифікат видалено", cloudinaryData }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Помилка сервера", error: error.message }),
      { status: 500 }
    );
  }
}
