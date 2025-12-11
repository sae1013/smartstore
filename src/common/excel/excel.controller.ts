import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExcelService } from './excel.service';

@Controller()
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Get('/excel/readfile')
  readFile() {
    return this.excelService.readFile();
  }
}
