// import Warranty from "../../components/mongo/warrantyModel";
// import { dbConnect } from "../../components/mongo/lib/mongolib";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const warranty = new Warranty(await req.json());
//     await warranty.save();

//     return NextResponse.json(
//       { success: true, data: warranty },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error saving warranty",
//         error: error.message,
//       },
//       { status: 400 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     await dbConnect();
//     const warranties = await Warranty.find({});
//     return NextResponse.json(warranties, { status: 200 });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error fetching warranties",
//         error: error.message,
//       },
//       { status: 400 }
//     );
//   }
// }
