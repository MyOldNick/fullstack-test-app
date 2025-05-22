import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { JwtAuthGuard } from 'src/core/jwt/jwt.auth-guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() data: CreateUserDto): Promise<GetUserDto> {
    return this.userService.createUser(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserInfo(@Req() req): Promise<GetUserDto> {
    return this.userService.getUserById(req.user.sub);
  }
}
