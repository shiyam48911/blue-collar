import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from 'src/schemas/users.schema';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns all users',
        type: User,
        isArray: true 
    })
    async findAll() {
        return await this.usersService.findAll();
    }
}