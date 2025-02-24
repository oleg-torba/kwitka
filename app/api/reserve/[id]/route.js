// import { dbConnect } from "@/app/components/mongo/lib/mongolib";
// import ReservModel from "@/app/components/mongo/ReservModel";
// import { NextResponse } from "next/server";

// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();

//     const { id } = await params;
//     const updatedData = await req.json();
//     if (!updatedData) {
//       return new NextResponse(
//         JSON.stringify({
//           success: false,
//           message: "Відсутні дані для оновлення",
//         }),
//         { status: 400 }
//       );
//     }
//     const updatedReserve = await ReservModel.findByIdAndUpdate(
//       id,

//       updatedData,
//       {
//         new: true,
//       }
//     );

//     if (!updatedReserve) {
//       return new NextResponse(
//         JSON.stringify({ success: false, message: "Резерв не знайдено" }),
//         { status: 404 }
//       );
//     }

//     return new NextResponse(
//       JSON.stringify({ success: true, data: updatedReserve }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return new NextResponse(
//       JSON.stringify({
//         success: false,
//         message: "Помилка при оновленні резерву",
//         error: error.message,
//       }),
//       { status: 400 }
//     );
//   }
// }
