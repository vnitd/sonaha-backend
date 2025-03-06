import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}
  @Post()
  async create(@Body() createContactDto: CreateContactDto,
) {
 try {
  await this.contactService.create(createContactDto)
  return {message:"Đã gửi thông tin, bạn check mail rồi đợi xíu nhé"}
 } catch (error) {
  return error
 }
  }
  @Get()
  async findAll(): Promise<any> {
    return this.contactService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.contactService.DeleteContact(+id);
  }
}
