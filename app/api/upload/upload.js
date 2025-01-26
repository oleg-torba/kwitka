import { IncomingForm } from "formidable";
import fs from "fs";
import { NextResponse } from "next/server";
import { Image } from "next-cloudinary"; // або ваш обраний метод інтеграції з Cloudinary

export const config = {
  api: {
    bodyParser: false, // вимикаємо стандартний парсер для файлів
  },
};

export async function POST(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();

    // Описуємо процес обробки форми
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error during file parsing:", err);
        return reject(
          new NextResponse("Error parsing form data", { status: 400 })
        );
      }

      try {
        // Завантажуємо зображення на Cloudinary
        const result = await Image.upload(files.file[0].filepath, {
          folder: "warranties", // ваш шлях на Cloudinary
        });

        console.log("Image uploaded successfully:", result);

        return resolve(
          new NextResponse(JSON.stringify(result), { status: 200 })
        );
      } catch (error) {
        console.error("Error uploading image:", error);
        return reject(
          new NextResponse("Error uploading image to Cloudinary", {
            status: 500,
          })
        );
      }
    });
  });
}
