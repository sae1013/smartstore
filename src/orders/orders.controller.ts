import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/orders/last-changed-orders')
  async findAll() {
    await this.ordersService.findLastChangedOrders();
    return 'hello world';
  }
}
