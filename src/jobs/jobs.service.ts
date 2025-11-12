import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class JobsService {
  constructor(private readonly OrdersService: OrdersService) {}
}
