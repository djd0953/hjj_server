import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  getAll() {
    return this.cityService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.cityService.findOne(id);
  }

  @Post()
  create(@Body() dto: { name: string, color: string }) {
    return this.cityService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: { name?: string, color?: string }) {
    return this.cityService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.cityService.delete(id);
  }
}
