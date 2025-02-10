// uploadBth
import {diskStorage} from "multer";
import { extname } from "path";
export const getStoreOption = (destination:string) =>{
   return diskStorage({
      // define cái nơi để lưu hình, đây, nó lưu hình ở chỗ này, nhớ tạofolder để nó chứa suộc code lưu hình
      destination:`./public/imgs/${destination}`,
      filename:(req,file ,callback)=>{
         const uniqueName = Date.now() // now sẽ luôn thay đổi 
         callback(null,`${uniqueName}${extname(file.originalname)}`)
      }
   })// qua videocontroler thử xem
}