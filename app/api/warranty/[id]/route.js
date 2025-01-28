import { dbConnect } from "@/app/components/mongo/lib/mongolib";
import Warranty from "@/app/components/mongo/warrantyModel";

export async function PUT(req, { params }) {
  const { id } = params; // Отримуємо `id` динамічно
  const { rezolution } = await req.json(); // Отримуємо тіло запиту

  try {
    await dbConnect();

    const updatedWarranty = await Warranty.findByIdAndUpdate(
      id,
      { rezolution },
      { new: true } // Повертаємо оновлений об'єкт
    );

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
