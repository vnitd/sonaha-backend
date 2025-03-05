import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaClient } from '@prisma/client';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class ContactService {

  constructor(
     private readonly emailService: EmailService,
  ){}

  prisma = new PrismaClient()
 async create(createContactDto: CreateContactDto) {

    try {
      const result = await this.prisma.contact_forms.create({
        // phone mình để string nha
        data:{
          name:createContactDto.name,
          email:createContactDto.email,
          phone:createContactDto.phone,
          content:createContactDto.content
        }
        // sau khi nhập vô, chắc là có cái mail gửi tới cái người đó luôn ha
      }) 
      const userText = `
        Cảm ơn bạn ${createContactDto.name} đã gửi yêu cầu tư vấn dự án nhà đất.`;
      const userHtml = `
        <h1>Cảm ơn bạn ${createContactDto.name}!</h1>
        <p>Chúng tôi đã nhận được yêu cầu tư vấn dự án nhà đất của bạn.</p>
        <p><strong>Tên:</strong> ${createContactDto.name}</p>
        <p><strong>Email:</strong> ${createContactDto.email}</p>
        <p><strong>Số điện thoại:</strong> ${createContactDto.phone}</p>
        <p><strong>Nội dung:</strong> ${createContactDto.content}</p>
        <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất. Chân thành cảm ơn!</p>
      `;

      await this.emailService.sendMail(
        createContactDto.email,
        'Chúng tôi đã nhận được thông tin của bạn',
        userText,
        userHtml,
      );
    } catch (error) {
      return error
    }
  }

  async findAll(): Promise<any > {
    try {
      const contactForms = await this.prisma.contact_forms.findMany({
        orderBy: { created_at: 'desc' }, // Sắp xếp theo ngày tạo giảm dần (mới nhất trước)
      });

      // Chuyển đổi BigInt thành string cho trường id (nếu id là BigInt)
      const formattedResults = contactForms.map((form) => ({
        ...form,
        id: form.id.toString(), // Chuyển BigInt thành string
      }));

      return {
        status: 200,
        data: formattedResults,
        message: 'Danh sách yêu cầu liên hệ được lấy thành công',
      };
    } catch (error) {
      throw new Error(`Failed to fetch contact forms: ${error.message}`);
    }
  }

 async DeleteContact(id: number) {
  try {
    await this.prisma.contact_forms.delete({
      where:{
        id
      }
    })
    return {message:'Xóa thành công'}
  } catch (error) {
    return error
  }
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}
