import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicketEntity } from './entities/ticket.entity';

@Controller('support')
export class SupportController {
  constructor(
    @InjectRepository(SupportTicketEntity)
    private readonly ticketRepo: Repository<SupportTicketEntity>,
  ) {}

  @Public()
  @Post('tickets')
  async submitTicket(
    @Body()
    body: {
      name: string;
      email: string;
      subject: string;
      message: string;
    },
  ) {
    const ticket = this.ticketRepo.create({
      subject: body.subject || 'General Inquiry',
      message: `From: ${body.name} (${body.email})\n\n${body.message}`,
    });
    await this.ticketRepo.save(ticket);
    return { success: true, message: 'Support ticket created successfully' };
  }

  @Get('tickets')
  async getMyTickets() {
    const tickets = await this.ticketRepo.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });
    return { success: true, data: tickets };
  }

  @Get('tickets/:id')
  async getTicketDetail(@Param('id') id: string) {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) return { success: false, message: 'Ticket not found' };
    return { success: true, data: ticket };
  }
}
