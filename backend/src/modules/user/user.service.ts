import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { GetUserDto } from './dto/get-user.dto';
import { comparePassword } from 'src/utils/hash-password.util';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto): Promise<GetUserDto> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: {
          email: data.email,
        },
      });

      if (foundUser) {
        throw new BadRequestException('User already exists');
      }
      const newUser = this.userRepository.create(data);
      const user = await this.userRepository.save(newUser);
      return plainToInstance(GetUserDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async getUserById(id: number): Promise<GetUserDto> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get user');
    }
  }

  async validateUser({ email, password }: AuthDto): Promise<GetUserDto> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });

      if (!user || !(await comparePassword(password, user.password)))
        throw new UnauthorizedException('Invalid credentials');

      return plainToInstance(GetUserDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error');
    }
  }
}
