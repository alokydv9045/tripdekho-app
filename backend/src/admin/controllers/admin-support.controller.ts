import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicketEntity } from '../../support/entities/ticket.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { UpdateTicketDto, AddTicketMessageDto } from '../dto/admin-support.dto';

@Roles(UserRole.SUPER_ADMIN, UserRole.SUPPORT_ADMIN)
@Controller('admin/support/tickets')
export class AdminSupportController {
  constructor(
    @InjectRepository(SupportTicketEntity)
    private readonly ticketRepo: Repository<SupportTicketEntity>,
  ) {}

  @Get()
  async getTickets(@Query() query: Record<string, unknown>) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const [tickets, total] = await this.ticketRepo.findAndCount({
      relations: { user: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      data: { tickets, total, totalPages: Math.ceil(total / limit) },
    };
  }

  @Get(':id')
  async getTicketDetail(@Param('id') id: string) {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return { success: true, data: ticket };
  }

  @Patch(':id')
  async updateTicket(@Param('id') id: string, @Body() data: UpdateTicketDto) {
    await this.ticketRepo.update(id, data);
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return { success: true, data: ticket };
  }

  @Post(':id/messages')
  async addTicketMessage(
    @Param('id') id: string,
    @Body() data: AddTicketMessageDto,
  ) {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const newReply = `\n\n=== Staff Reply (${new Date().toLocaleString()}) ===\n${data.text}`;
    ticket.message += newReply;
    await this.ticketRepo.save(ticket);

    return { success: true, data: ticket };
  }
}
