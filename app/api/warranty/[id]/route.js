import { dbConnect } from "@/app/components/mongo/lib/mongolib";
import Warranty from "@/app/components/mongo/warrantyModel";

export async function PUT(req, { params }) {
  const { id } = await params;
  const updatedData = await req.json();

  try {
    await dbConnect();

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
