import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  findAll(): string[] {
    // Placeholder implementation; replace with real data source integration.
    return ['order-1', 'order-2'];
  }
}
