import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Categories } from 'src/schemas/categories.schema';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns all categories',
        type: Categories,
        isArray: true 
    })
    async findAll() {
        return await this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns a category by ID',
        type: Categories
    })
    async findOne(@Param('id') id: string) {
        return await this.categoriesService.findOne(id);
    }
}