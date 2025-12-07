import { Controller } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}
}
