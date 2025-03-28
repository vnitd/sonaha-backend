import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import nodemailer, { createTransport } from 'nodemailer';


// cứ liên quan tới upload env lên thì cứ dùng nest config 
@Injectable()
export class EmailService{
   private readonly transporter : nodemailer.Transporter;
   constructor(
      private readonly configService: ConfigService,
   ){
      this.transporter = createTransport({
         host: 'smtp.gmail.com',
         port: 587,
         auth: {
           user: this.configService.get<string>('MAIL_USER'),
           pass: this.configService.get<string>('MAIL_PASS'),
         },
       });
   }
   async sendMail(to:string,subject:string,text:string,html?:string){
   console.log('Email User:', this.configService.get<string>('EMAIL_USER'));
console.log('Email Pass:', this.configService.get<string>('EMAIL_PASS'));

      const mailOption={
         from:this.configService.get<string>('MAIL_USER'),
         to,
         subject,
         text
      }
      return await this.transporter.sendMail(mailOption);
   }
}