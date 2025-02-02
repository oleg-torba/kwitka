// import { dbConnect } from "@/app/components/mongo/lib/mongolib";

// export async function POST(req) {
//   const {
//     repairNumber,
//     certificateNumber,
//     part,
//     saleDate,
//     reporting,
//     imageUrl,
//   } = await req.json();

//   if (
//     !repairNumber ||
//     !certificateNumber ||
//     !part ||
//     !saleDate ||
//     !reporting ||
//     !imageUrl
//   ) {
//     return new Response(
//       JSON.stringify({
//         success: false,
//         error: "Усі поля мають бути заповнені!",
//       }),
//       { status: 400 }
//     );
//   }

//   try {
//     // Підключення до бази даних
//     const { db } = await dbConnect();
//     const collection = db.collection("warranties");

//     // Створення нового запису для сертифікату
//     const newCertificate = {
//       repairNumber,
//       certificateNumber,
//       part,
//       saleDate,
//       reporting,
//       imageUrl,
//       createdAt: new Date(),
//     };

//     // Вставка запису в колекцію MongoDB
//     const result = await collection.insertOne(newCertificate);

//     if (result.acknowledged) {
//       return new Response(
//         JSON.stringify({
//           success: true,
//           message: "Сертифікат успішно додано!",
//         }),
//         { status: 200 }
//       );
//     } else {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           error: "Не вдалося додати сертифікат",
//         }),
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error(error);
//     return new Response(
//       JSON.stringify({
//         success: false,
//         error: "Сталася помилка при збереженні даних",
//       }),
//       { status: 500 }
//     );
//   }
// }
