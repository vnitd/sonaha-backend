import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, Matches } from "class-validator";

enum UserRole {
   ADMIN = 'admin',
   USER = 'user',
   EMPLOYEE = 'employee'
}

export class CreateUserDto {
   @ApiProperty()
   @IsEmail({},{message:'không đúng định dạng'})
   email:string;
   @ApiProperty()
   password: string; 
   @ApiProperty()
   full_name:string;

   @ApiProperty()
   @IsString({ message: 'Sai định dạng' })
   @Matches(/^(\+?\d{1,4}[\s-]?)?(\(?\d{1,3}\)?[\s-]?)?[\d\s-]{7,15}$/, { 
     message: 'Số điện thoại không hợp lệ' 
   })
   phone_number: string; 
   @ApiProperty({
      description: 'Role of the user (admin, user, employee)',
      enum: UserRole,
      default: UserRole.USER,
    })
    @IsEnum(UserRole, { message: 'Role phải là admin, employee,user' })
    role: UserRole;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsOptional() 
    img: any; 

    @ApiHideProperty() 
    avartar_url: string;
}
