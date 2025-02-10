import { Exclude, Expose } from "class-transformer";

export class userDto{
   @Exclude()
   account_id : string
   @Expose()
   full_name:string
   @Expose()
   email:string
   @Expose()
   phone_number:string
   @Exclude()
   password:string
   @Exclude()
   refresh_token:string
   @Exclude()
   face_id:string
   @Expose()
   avartar_url:string
   @Exclude()
   access_token:string
   @Exclude()
   reset_token:string
}