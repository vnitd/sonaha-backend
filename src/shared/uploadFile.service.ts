import { diskStorage } from "multer";
import { extname } from "path";
import { Request } from "express";

export const getStoreOption = (destination: string) => {
   return {
      storage: diskStorage({
         // Thư mục lưu trữ file
         destination: `./public/imgs/${destination}`,
         filename: (req, file, callback) => {
            const uniqueName = Date.now(); // Tạo tên file duy nhất
            callback(null, `${uniqueName}${extname(file.originalname)}`);
         },
      }),
      limits: {
         fileSize: 6 * 1024 * 1024, // Giới hạn dung lượng 2MB
      },
      fileFilter: (req: Request, file: Express.Multer.File, callback: Function) => {
         const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
         if (!allowedMimeTypes.includes(file.mimetype)) {
            return callback(new Error("Chỉ cho phép file ảnh (.jpg, .png, .gif)"));
         }
         callback(null, true);
      },
   };
};
