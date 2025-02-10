import { Exclude, Expose } from "class-transformer"

export class getBannerDto{
   @Exclude()
   id : string
   @Expose()
   tittle:string
   @Expose()
   email:string
   @Expose()
   img_url:string
   @Exclude()
   end_date:string
}