import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  getAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.itemService.findOne(id);
  }

  @Post()
  create(@Body() dto: { name: string }) {
    return this.itemService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: { name?: string}) {
    return this.itemService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.itemService.delete(id);
  }
}
