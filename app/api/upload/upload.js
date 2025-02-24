// import { IncomingForm } from "formidable";
// import { NextResponse } from "next/server";
// import { Image } from "next-cloudinary";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req) {
//   return new Promise((resolve, reject) => {
//     const form = new IncomingForm();

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error("Error during file parsing:", err);
//         return reject(
//           new NextResponse("Error parsing form data", { status: 400 })
//         );
//       }

//       try {
//         const result = await Image.upload(files.file[0].filepath, {
//           folder: "warranties",
//         });

//         console.log("Image uploaded successfully:", result);

//         return resolve(
//           new NextResponse(JSON.stringify(result), { status: 200 })
//         );
//       } catch (error) {
//         console.error("Error uploading image:", error);
//         return reject(
//           new NextResponse("Error uploading image to Cloudinary", {
//             status: 500,
//           })
//         );
//       }
//     });
//   });
// }
